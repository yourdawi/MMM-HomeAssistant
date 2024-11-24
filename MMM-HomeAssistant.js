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
        this.entities = data.filter(entity => this.config.entities.some(configEntity => configEntity.entity_id === entity.entity_id));
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
        wrapper.style.display = "flex"; // Next to each other
        wrapper.style.flexDirection = "column"; // Vertical
        wrapper.style.alignItems = "flex-end"; // Right

        var sensorsWrapper = document.createElement("div");
        sensorsWrapper.style.display = "flex"; // Entities next to each other

        var alertDiv = null;

        this.entities.forEach(entity => {
            var configEntity = this.config.entities.find(configEntity => configEntity.entity_id === entity.entity_id);
            var unit = entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : "";

            // Check if its above, below or equal
            if (configEntity.threshold !== undefined) {
                if ((configEntity.thresholdType === "above" && parseFloat(entity.state) > configEntity.threshold) ||
                    (configEntity.thresholdType === "below" && parseFloat(entity.state) < configEntity.threshold) ||
                    (configEntity.thresholdType === "equal" && parseFloat(entity.state) === configEntity.threshold)) {
                    var entityDiv = document.createElement("div");
                    entityDiv.innerHTML = `${entity.state}${unit}`;
                    entityDiv.style.marginRight = "10px"; // Space between Entities
                    sensorsWrapper.appendChild(entityDiv);
                }
            } else {
                var entityDiv = document.createElement("div");
                entityDiv.innerHTML = `${entity.state}${unit}`;
                entityDiv.style.marginRight = "10px"; // Space between Entities
                sensorsWrapper.appendChild(entityDiv);
            }
        });

        wrapper.appendChild(sensorsWrapper);
        if (alertDiv) {
            wrapper.appendChild(alertDiv);
        }

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOME_ASSISTANT_DATA") {
            this.processData(payload);
        }
    }
});
