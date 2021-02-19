//python server terminal line: python -m SimpleHTTPServer 8000
//browser: http://localhost:8000
// ctr C to end server


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

//Global Variables:
var chapter = null;
var teamMembers = [null, null, null, null, null, null];

onStart();
loadForm();


//When the page loads:
function onStart()
{
    
    document.getElementById("heading").innerHTML = "Add a Chapter";


    //Fetch all the team chapters info from localStorage

    let team = JSON.parse(window.localStorage.getItem("team"));
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


}

function loadForm()
{
    // document.getElementById("fname").value = chapter.getLeaderName();
    // document.getElementById("femail").value = chapter.getLeaderEmail();
    // document.getElementById("fschool").value = chapter.getSchool();
    // document.getElementById("fdescription").innerHTML = chapter.getDescription();
    // document.getElementById("fsupport").innerHTML = chapter.getSupport();
    // if(chapter.getStatus() == 0)
    // {
    //     document.getElementById("fstatus0").selected = true;
    // }else if(chapter.getStatus() == 1)
    // {
    //     document.getElementById("fstatus1").selected = true;
    // }else if(chapter.getStatus() == 2)
    // {
    //     document.getElementById("fstatus2").selected = true;
    // }else if(chapter.getStatus() == 3)
    // {
    //     document.getElementById("fstatus3").selected = true;
    // }

    // for(i = 1; i<7; i++)
    // {
    //     let idStr = "fteamMember" + i;
    //     document.getElementById(idStr).innerHTML = teamMembers[i-1].getName();
    //     if(chapter.getTeamMemberID() == i)
    //     {
    //         document.getElementById(idStr).selected = true;
    //     }
    // }
    
}

// function saveChanges()
// {

//     chapter.setLeaderName(document.getElementById("fname").value);
//     chapter.setLeaderEmail(document.getElementById("femail").value);
//     chapter.setSchool(document.getElementById("fschool").value);
//     chapter.setDescription(document.getElementById("fdescription").value);
//     chapter.setSupport(document.getElementById("fsupport").value);
//     chapter.updateStatus(parseInt(document.getElementById("fstatus").value));
//     chapter.updateStatus(parseInt(document.getElementById("fstatus").value));

//     let newMemberID = parseInt(document.getElementById("fteamMember").value);
//     if(newMemberID != chapter.getTeamMemberID())
//     {
//         //first, delete this chapter from the old member's list
//         let oldMember = teamMembers[chapter.getTeamMemberID() - 1];
//         for(i = 0; i < oldMember.getChapterList().length; i++)
//         {
//             if(oldMember.getChapterList()[i].getChapterID() == chapter.getChapterID())
//             {
//                 oldMember.getChapterList().splice(i, 1);
//             }
//         }

//         //update teamMember ID in the chapter object
//         chapter.setTeamMember(newMemberID);

//         //Add the chapter to the new team member's list
//         teamMembers[newMemberID - 1].addChapter(chapter);
//     }else{
//         let member = teamMembers[chapter.getTeamMemberID() - 1];
//         for(i = 0; i < member.getChapterList().length; i++)
//         {
//             if(member.getChapterList()[i].getChapterID() == chapter.getChapterID())
//             {
//                 teamMembers[chapter.getTeamMemberID() - 1].getChapterList()[i] = chapter;
//             }
//         }

//     }

//     //Update local storage:
//     window.localStorage.setItem("team", JSON.stringify(teamMembers));

//     //Set everything back to null and go back to index
//     chapter = null;
//     window.sessionStorage.setItem("currentChapterEdit", "");
//     window.location.href = "index.html";

// }

function cancel()
{
    loadForm();
    // document.getElementById("test-p").innerHTML = "cancel clicked";

    // chapter = null;
    window.sessionStorage.setItem("currentChapterEdit", "");
    window.location.href = "index.html";
}


