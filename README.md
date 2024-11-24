# MMM-HomeAssistant

Module to display informations out of HomeAssistant

It will use the friendly name and also the unit of measurement.

------------

## Installation

Download this into your modules folder

For example:

cd ~/MagicMirror/modules

git clone https://github.com/yourdawi/MMM-HomeAssistant

------------

## Config

Add to config

```javascript
{
    module: "MMM-HomeAssistant",
    position: "top_right",
    config: {
        homeAssistantUrl: "http://localhost:8123",
        accessToken: "YOUR_ACCESS_TOKEN",
        entities: [
            { entity_id: "sensor.humidity", threshold: 70, thresholdType: "above" }, // Example for above
            { entity_id: "sensor.temp", threshold: 18, thresholdType: "below" }, // Example for below
            { entity_id: "sensor.door" }, // Without limitation
            { entity_id: "sensor.water", threshold: 50, thresholdType: "equal" } // Example for equal
        ]
    }
}

```
