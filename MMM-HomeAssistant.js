Module.register("MMM-HomeAssistant", {
    defaults: {
        updateInterval: 60000,
        homeAssistantUrl: "http://localhost:8123",
        accessToken: "YOUR_ACCESS_TOKEN",
        entities: []
    },

    start: function() {
        this.sendSocketNotification("GET_HOME_ASSISTANT_DATA", {
            homeAssistantUrl: this.config.homeAssistantUrl,
            accessToken: this.config.accessToken
        });
        this.scheduleUpdate();
    },

    getData: function() {
        var self = this;
        var url = this.config.homeAssistantUrl + "/api/states";
        var headers = {
            "Authorization": "Bearer " + this.config.accessToken
        };

        fetch(url, { headers: headers })
            .then(response => response.json())
            .then(data => {
                self.processData(data);
            })
            .catch(error => {
                console.error("Error fetching data from Home Assistant:", error);
            });
    },

    processData: function(data) {
        this.entities = data.filter(entity => this.config.entities.includes(entity.entity_id));
        this.updateDom();
    },

    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.sendSocketNotification("GET_HOME_ASSISTANT_DATA", {
                homeAssistantUrl: self.config.homeAssistantUrl,
                accessToken: self.config.accessToken
                    });
        }, this.config.updateInterval);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        this.entities.forEach(entity => {
            var entityDiv = document.createElement("div");
            var unit = entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : "";
            entityDiv.innerHTML = `${entity.attributes.friendly_name}: ${entity.state}${unit}`;
            wrapper.appendChild(entityDiv);
        });
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOME_ASSISTANT_DATA") {
            this.processData(payload);
        }
    }
});
