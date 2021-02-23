/**
 *@NApiVersion 2.x
 *@NAmdConfig  ./__config.json 
 *@NScriptType Suitelet
 */
define(['N/file', 'N/auth', 'netsuite'], function(file, auth, netsuite) {

    function getLocationByIP(context) {
        var clientIpAddress = context.request.clientIpAddress
        var user = netsuite.getUser();
        if (user.id === 119) {
            clientIpAddress = '81.82.193.138'
        }
        var locations = netsuite.searchSync({
            searchType: "location",
            searchFilter: [
                ['custrecord_location_public_ip', 'is', clientIpAddress]
            ],
            searchColumns: [
                { name: 'internalid' },
                { name: 'name' },
                { name: 'namenohierarchy' },
                { name: 'phone' },
                { name: 'city' },
                { name: 'state' },
                { name: 'country' },                
                { name: 'subsidiary' },
                { name: 'custrecord_location_public_ip' },
                { name: 'custrecord_location_printserver_ip' },                
            ]
        })
        if (locations.length == 1) {
            return { location: locations[0] };
        }
        return { location: null }
    }

    function getEmployeesByLocation(context) {
        var parameters = context.request.parameters
        var locationID = parameters.locationID || getLocationByIP(context).location.internalid;
        if (!locationID) {
            var location = getLocationByIP(context).location
            var locationID = location ? location.internalid : null
        }
        var employees = []
        if (locationID) {
            var employees = netsuite.searchSync({
                searchType: "employee",
                searchFilter: [
                    ['location', 'anyof', locationID],
                    'OR',
                    ['location', 'anyof', '@NONE@']
                ],
                searchColumns: [
                    { name: 'internalid' },
                    { name: 'firstname' },
                    { name: 'lastname' },
                    { name: 'entityid' },
                    { name: 'email' },
                    { name: 'subsidiary' },
                    { name: 'location' },
                    { name: 'department' },
                ]
            })
        }
        return { employees: employees }
        
    }


    function onRequest(context) {

        // context.response.setHeader('Content-Type', 'application/json');
        // context.response.write(JSON.stringify(Object.keys(auth)));

        // return
        var clientIpAddress = context.request.clientIpAddress
        var allowedIPs = ['81.82.193.138', '80.188.3.82']
        var allowed = false;
        allowedIPs.forEach(function(ip) {
            if (ip == clientIpAddress) {
                allowed = true;
            }
        })
        if (!allowed) {
            context.response.setHeader('Content-Type', 'application/json');
            context.response.write(JSON.stringify({ error: "Not allowed..."}));
            return;
        }

        var parameters = context.request.parameters
        var type = parameters.type;
        if (type) {
            var data;
            switch(type) {
                case 'getLocationByIP':
                    data = getLocationByIP(context)
                    break;
                case 'getEmployeesByLocation':
                    data = getEmployeesByLocation(context)
                    break;
                default:
                    data = context
            }
            context.response.setHeader('Content-Type', 'application/json');
            context.response.write(JSON.stringify(data));
            return;
    
        }
        var html = file.load({
            id: '/SuiteScripts/Manufacturing/frontend/index.html'
        }).getContents();
        context.response.setHeader('Access-Control-Allow-Origin', '*');
        context.response.write(html);
    }

    return {
        onRequest: onRequest
    }
});
