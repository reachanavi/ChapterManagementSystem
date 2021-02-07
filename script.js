    //python server terminal line: python -m SimpleHTTPServer 8000
    //browser: http://localhost:8000
    // ctr C to end server
    
    //GLobal variables

    //Keep track of how many chapters have already been synced
    var numSynced = 0;
    if(window.localStorage.getItem("numSyncedStr") == null)
    {
        window.localStorage.setItem('numSyncedStr', '0');
    }
    else
    {
        numSynced = parseInt(window.localStorage.getItem("numSyncedStr"));
    }

    //keep track of how many total applications are on the spreadsheet
    var numSheetApps = 0;
    
    
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '405180806218-1tr14dtj06ad66b4pl0k8h5t0kmdno1r.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyBaNCBk3VBgzRvUI45hEcD_Qo4V_t8sNvE';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        }, function(error) {
            appendPre(JSON.stringify(error, null, 2));
        });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'none';
            sync();
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }

    /**
     * Print the names and majors of students in a sample spreadsheet:
     * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     */
    function sync() {
        findNumSheetApps();
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
            range: 'Applications!A2:H6',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
            document.getElementById("paragraph").innerHTML = "heyyy";
            //appendPre('Name, Major:');
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                //appendPre(row[0] + ', ' + row[4]);
            }
            } else {
            appendPre('No data found.');
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });
    }

    function findNumSheetApps()
    {
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
            range: 'TeamInfo!B7:B7',
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                numSheetApps = parseInt(range.values[0][0]) - 1;
            }
        }, function(response) {
            appendPre('Error: ' + response.result.error.message);
        });
    }

    function testFunction()
    {
        appendPre("Synced chapters: " + numSynced);
        appendPre("Total apps on sheet: " + numSheetApps);
    }