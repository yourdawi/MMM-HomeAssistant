const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_HOME_ASSISTANT_DATA") {
            this.getHomeAssistantData(payload);
        }
    },

    getHomeAssistantData: function(config) {
        const url = `${config.homeAssistantUrl}/api/states`;
        const headers = {
            "Authorization": `Bearer ${config.accessToken}`
        };

        fetch(url, { headers: headers })
            .then(response => response.json())
            .then(data => {
                this.sendSocketNotification("HOME_ASSISTANT_DATA", data);
            })
            .catch(error => {
                console.error("Error fetching data from Home Assistant:", error);
            });
    }
});
