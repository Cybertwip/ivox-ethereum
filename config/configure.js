var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXL5V4cY1Max_pu3I2_4W9XAWnAWNa30aBshR6v4Cpzn4T8Q_RsNHGEOSgCT3b1X9dmmQjGnPqU6AHkg',
    'client_secret': 'EKlPUeAbsZYyf1YYEXeMp-WCHtbVb33CVRgsvqlwDRlTB4fS-VlK9KTDBnIdVivbV8mMyiC4gQJE_PA1',
    'headers' : {
		'custom': 'header'
    }
});