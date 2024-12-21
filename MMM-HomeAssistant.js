Module.register("MMM-HomeAssistant", {
    defaults: {
        updateInterval: 60000,
        homeAssistantUrl: "http://localhost:8123",
        accessToken: "YOUR_ACCESS_TOKEN",
        entities: []
    },

    start: function() {
        this.scheduleUpdate();
        this.getData();
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
            self.getData();
        }, this.config.updateInterval);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.alignItems = "flex-start"; // Align entities to the left

        this.entities.forEach(entity => {
            var configEntity = this.config.entities.find(configEntity => configEntity.entity_id === entity.entity_id);
            var unit = entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : "";
            var displayName = (configEntity.useFriendlyName === undefined || configEntity.useFriendlyName) ? entity.attributes.friendly_name : configEntity.displayName || "";

            if (configEntity.threshold === undefined || 
               (configEntity.thresholdType === "above" && parseFloat(entity.state) > configEntity.threshold) || 
               (configEntity.thresholdType === "below" && parseFloat(entity.state) < configEntity.threshold) || 
               (configEntity.thresholdType === "equal" && parseFloat(entity.state) === configEntity.threshold)) {
                var entityDiv = document.createElement("div");
                entityDiv.innerHTML = `${displayName ? displayName + ': ' : ''}${entity.state}${unit}`;
                entityDiv.style.marginBottom = "10px"; // Space between entities
                wrapper.appendChild(entityDiv);
            }
        });

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HOME_ASSISTANT_DATA") {
            this.processData(payload);
        }
    }
});