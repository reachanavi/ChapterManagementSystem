//python server terminal line: python -m SimpleHTTPServer 8000
//browser: http://localhost:8000
// ctr C to end server
//to do: update syncedChapters global variable and in local storage after syncing



//CLASSES:
class TeamMember {
    constructor(name, email, idNumber, chaptersArr)
    {
        this.name = name;
        this.email = email;
        this.idNumber = idNumber
        this.chapters = chaptersArr;
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
    constructor(leaderName, leaderEmail, school, city, description, support, status, id)
    {
        this.leaderName = leaderName;
        this.leaderEmail = leaderEmail;
        this.school = school;
        this.city = city;
        this.description = description;
        this.support = support;
        this.status = status;
        this.chapterID = id;
        this.teamMemberID = 0;
    }

    getLeaderName()
    {
        return this.leaderName;
    }

    getLeaderEmail()
    {
        return this.leaderEmail;
    }

    getSchool()
    {
        return this.school;
    }

    getCity()
    {
        return this.city;
    }

    getDescription()
    {
        return this.description;
    }

    getSupport()
    {
        return this.support;
    }

    getStatus()
    {
        return this.status;
    }

    getChapterID()
    {
        return this.chapterID;
    }

    getTeamMemberID()
    {
        return this.teamMemberID;
    }

    setLeaderName(name)
    {
        this.leaderName = name;
    }

    setLeaderEmail(email)
    {
        this.leaderEmail = email;
    }

    setSchool(school)
    {
        this.school = school;
    }

    setCity(city)
    {
        this.city = city;
    }

    setDescription(description)
    {
        this.description = description;
    }

    setSupport(support)
    {
        this.support = support;
    }

    updateStatus(newStatus)
    {
        this.status = newStatus;
    }

    setChapterID(id)
    {
        this.chapterID = id;
    }

    setTeamMember(id)
    {
        this.teamMemberID = id;
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
    var team = new Array();
    team.push(new TeamMember("Member Name 1", "member1@email.com", 1, new Array()));
    team.push(new TeamMember("Member Name 2", "member2@email.com", 2, new Array()));
    team.push(new TeamMember("Member Name 3", "member3@email.com", 3, new Array()));
    team.push(new TeamMember("Member Name 4", "member4@email.com", 4, new Array()));
    team.push(new TeamMember("Member Name 5", "member5@email.com", 5, new Array()));
    team.push(new TeamMember("Member Name 6", "member6@email.com", 6, new Array()));
    window.localStorage.setItem('team', JSON.stringify(team));
    window.localStorage.setItem("teamMembersCreated", "true");
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
 * 
 */
    async function sync() {
    
    numSheetApps = await findNumSheetApps();
    await updateLocalStorage(numSheetApps);
    
    for(i = 0; i<6; i++)
    {
        let currentMember = teamMembers[i];
        for(c = 0; c< currentMember.getChapterList().length; c++)
        {
            if(currentMember.getChapterList()[c] != null)
            {
                let currentChapter = currentMember.getChapterList()[c];
                let idString = "location";
                idString = idString + (i + 1);
                idString += c + 1;
                document.getElementById(idString).innerHTML = currentChapter.getCity();
                let statusStr = "";
                if(currentChapter.getStatus() == 0)
                {
                    statusStr = "Applied";
                    
                }else if(currentChapter.getStatus() == 1)
                {
                    statusStr = "Approved";
                }else if(currentChapter.getStatus() == 2){
                    statusStr = "Started";
                }else{
                    statusStr = "Error";
                }
                idString = "status" + (i + 1);
                idString += c + 1;
                document.getElementById(idString).innerHTML = statusStr;
            }
        }
    }
    numSynced = numSheetApps;
    window.localStorage.setItem("numSyncedStr", numSynced);
    
    
}

async function findNumSheetApps()
{
    await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
        range: 'TeamInfo!B8:B8',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            numSheetApps = parseInt(range.values[0][0]) - 1;
        }
    }, function(response) {
        appendPre('Error in findNumSheetApps: ' + response.result.error.message);
    });
    return numSheetApps;
}
L

async function updateLocalStorage(endRow)
{
    let startingRow = numSynced + 2;
    let endingRow = endRow + 1;
    let team = JSON.parse(window.localStorage.getItem("team"));
    let i = 0;
    for(i = 0; i<6; i++)
    {
        teamMembers[i] = new TeamMember(team[i].name, team[i].email, team[i].idNumber, new Array());
        if(team[i].chapters.length > 0)
        {
            for(j = 0; j<team[i].chapters.length; j++)
            {
                let c = new Chapter(team[i].chapters[j].leaderName, team[i].chapters[j].leaderEmail, 
                    team[i].chapters[j].school, team[i].chapters[j].city, team[i].chapters[j].description,
                    team[i].chapters[j].support, parseInt(team[i].chapters[j].status), parseInt(team[i].chapters[j].chapterID));
                c.setTeamMember(i + 1);
                teamMembers[i].addChapter(c);
            }
        }
    }

    if(startingRow <= endingRow)
    {
        await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1-sVr5PKZpI0DdJhuxc32CkSWxhSYtvW55okIFgsIaW0',
            range: 'Applications!B' + startingRow.toString() + ':H' + endingRow.toString(),
        }).then(function(response) {
            var range = response.result;
            if (range.values.length > 0) {
                for(r = 0; r < range.values.length; r++)
                {
                    let currentChapter = new Chapter(range.values[r][0], range.values[r][1], 
                    range.values[r][2], range.values[r][3], range.values[r][4], range.values[r][5], 0,
                    numSynced + 1 + r);
                    let memberNumber = parseInt(range.values[r][6]);
                    if(teamMembers[memberNumber - 1] == null)
                    {
                        let currentMember = new TeamMember(team[memberNumber - 1].name, team[memberNumber - 1].email, memberNumber);
                        teamMembers[memberNumber - 1] = currentMember;
                    }
                    currentChapter.setTeamMember(memberNumber);
                    teamMembers[memberNumber - 1].addChapter(currentChapter);
                
                }
                window.localStorage.setItem('team', JSON.stringify(teamMembers));
            }
        }, function(response) {
            appendPre('Error in findNumSheetApps: ' + response.result.error.message);
        });
    }
    
}

function goToEdit(id)
{
    let member = parseInt(id.substring(7, 8));
    let chapterIndex = parseInt(id.substring(8, 9));
    let currentChapter = teamMembers[member - 1].getChapterList()[chapterIndex - 1];
    window.sessionStorage.setItem("currentChapterEdit", JSON.stringify(currentChapter));
    window.location.href = "editChapter.html";
}

function goToViewDetails(id)
{
    let member = parseInt(id.substring(8, 9));
    let chapterIndex = parseInt(id.substring(9, 10));
    let currentChapter = teamMembers[member - 1].getChapterList()[chapterIndex - 1];
    window.sessionStorage.setItem("currentChapterView", JSON.stringify(currentChapter));
    window.location.href = "viewDetails.html";
}

function testFunction()
{
    appendPre("Synced chapters: " + numSynced);
    appendPre("Total apps on sheet: " + numSheetApps);
    appendPre("Chapter ID of 2: " + teamMembers[2].getChapterList()[0].getChapterID());
}