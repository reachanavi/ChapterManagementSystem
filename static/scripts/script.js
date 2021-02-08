//python server terminal line: python -m SimpleHTTPServer 8000
//browser: http://localhost:8000
// ctr C to end server
//to do: update syncedChapters global variable and in local storage after syncing

//CLASSES:
class TeamMember {
    constructor(name, email, idNumber)
    {
        this.name = name;
        this.email = email;
        this.idNumber = idNumber
        this.chapters = new Array();
    }

    getChapterList()
    {
        return this.chapters;
    }

    getName()
    {
        return this.name;
    }

    addChapter(chapter)
    {
        this.chapters.push(chapter);
    }
}

class Chapter {
    constructor(leaderName, leaderEmail, school, city, description, support)
    {
    this.leaderName = leaderName;
    this.leaderEmail = leaderEmail;
    this.school = school;
    this.city = city;
    this.description = description;
    this.support = support;
    this.status = 0;
    // this.teamMember = teamMember;
    }
    getCity()
    {
    return this.city;
    }
    getStatus()
    {
    return this.status;
    }
}

//Global variables
//team members array
var teamMembers = [null, null, null, null, null, null];

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
var numSheetApps;

//check whether team members have been created
if(window.localStorage.getItem("teamMembersCreated") == null)
{
    // testMember = new TeamMember("Test Member Name", "test@email.com");  
    // testChapter = new Chapter("leader name", "email@email", "school name", "sample city", 
    // "sample description", "sample support");
    // testMember.addChapter(testChapter);
    var team = new Array();
    team.push(new TeamMember("Member Name 1", "member1@email.com", 1));
    team.push(new TeamMember("Member Name 2", "member2@email.com", 2));
    team.push(new TeamMember("Member Name 3", "member3@email.com", 3));
    team.push(new TeamMember("Member Name 4", "member4@email.com", 4));
    team.push(new TeamMember("Member Name 5", "member5@email.com", 5));
    team.push(new TeamMember("Member Name 6", "member6@email.com", 6));
    window.localStorage.setItem('team', JSON.stringify(team));
    window.localStorage.setItem("teamMembersCreated", "true");

    // var currentMembers = JSON.parse(window.localStorage.getItem("team"));
    // document.getElementById("test-p").style.color = "red";
    // document.getElementById("test-p").innerHTML = currentMembers[6].chapters[currentMembers[6].chapters.length - 1].city;
    

}


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
    async function sync() {
    // appendPre("hello");
    // numSheetApps = findNumSheetApps();
    numSheetApps = await findNumSheetApps();
    await updateLocalStorage(numSheetApps); 
    // appendPre(teamMembers[2].getChapterList()[0].getCity());
    // document.getElementById("test-p").innerHTML = teamMembers[2].getChapterList()[0].getCity();
    
    
    /*updateTables();
    // gapi.client.sheets.spreadsheets.values.get({
    //     spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
    //     range: 'Applications!A2:H6',
    // }).then(function(response) {
    //     var range = response.result;
    //     if (range.values.length > 0) {
    //     // document.getElementById("paragraph").innerHTML = "heyyy";
    //     //appendPre('Name, Major:');
    //     for (i = 0; i < range.values.length; i++) {
    //         var row = range.values[i];
    //         // Print columns A and E, which correspond to indices 0 and 4.
    //         //appendPre(row[0] + ', ' + row[4]);
    //     }
    //     } else {
    //     appendPre('No data found.');
    //     }
    // }, function(response) {
    //     appendPre('Error: ' + response.result.error.message);
    // }); */
}

async function findNumSheetApps()
{
    // let num = 4;
    await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
        range: 'TeamInfo!B7:B7',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            numSheetApps = parseInt(range.values[0][0]) - 1;
            appendPre("1st place: " + numSheetApps);
            
        }
    }, function(response) {
        appendPre('Error in findNumSheetApps: ' + response.result.error.message);
    });
    return numSheetApps;
    
}


async function updateLocalStorage(endRow)
{
    // appendPre("hi again:" + numSheetApps);
    let startingRow = numSynced + 2;
    let endingRow = endRow + 1;
    // appendPre(endingRow.toString());
    if(startingRow < endingRow)
    {
    
    await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
        range: 'Applications!B' + startingRow.toString() + ':H' + endingRow.toString(),
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            let team = JSON.parse(window.localStorage.getItem("team"));
            for(r = 0; r < range.values.length; r++)
            {

                let currentChapter = new Chapter(range.values[r][0], range.values[r][1], 
                range.values[r][2], range.values[r][3], range.values[r][4], range.values[r][5]);
                //get the ID number of the assigned member:
                let memberNumber = parseInt(range.values[r][6]);

                //check if the member has been created:
                if(teamMembers[memberNumber - 1] == null)
                {
                let currentMember = new TeamMember(team[memberNumber - 1].name, team[memberNumber - 1].email);
                teamMembers[memberNumber - 1] = currentMember;
                }
                teamMembers[memberNumber - 1].addChapter(currentChapter);
            
            }

            //update local storage w new team member and chapter info
            
            for(i = 0; i<6; i++)
            {
                if(teamMembers[i] == null)
                {
                let newMember = new TeamMember(team[i].name, team[i].email);
                teamMembers[i] = newMember;
                
                }
                
            }
            window.localStorage.setItem('team', JSON.stringify(teamMembers));
        }
    }, function(response) {
        appendPre('Error in findNumSheetApps: ' + response.result.error.message);
    });
    }
    
}

function testFunction()
{
    appendPre("Synced chapters: " + numSynced);
    appendPre("Total apps on sheet: " + numSheetApps);
}