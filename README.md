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
        updateInterval: 300000, // 5 min
				homeAssistantUrl: "http://HomeAssistant_URL:PORT",
				accessToken: "TOKEN", // Insert your token (https://developers.home-assistant.io/docs/auth_api/#long-lived-access-token)
				entities: ["sensor.temperature", "sensor.humidity"] // Add your Sensors or other Entities
			}
}
```
