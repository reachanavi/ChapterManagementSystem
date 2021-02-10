
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
    constructor(leaderName, leaderEmail, school, city, description, support, id)
    {
        this.leaderName = leaderName;
        this.leaderEmail = leaderEmail;
        this.school = school;
        this.city = city;
        this.description = description;
        this.support = support;
        this.status = 0;
        this.chapterID = id;
        this.teamMemberID = 0;
    }

    getCity()
    {
        return this.city;
    }

    getStatus()
    {
        return this.status;
    }

    updateStatus(newStatus)
    {
        this.status = newStatus;
    }

    getChapterID()
    {
        return this.chapterID;
    }

    setTeamMember(id)
    {
        this.teamMemberID = id;
    }
}

//Global Variables:
var chapter = null;
var teamMembers = [null, null, null, null, null, null];

document.getElementById("test-p").innerHTML = chapter.city;
onStart();


//When the page loads:
// function onStart()
// {
//     let teamMembersStr = JSON.parse(window.localStorage.getItem("team"));
//     for(i = 0; i<6; i++)
//     {
//         let member = new TeamMember(teamMembersStr[i].name, teamMembersStr[i].email);
//         teamMembers[i] = member;
//     }
//     let chapterStr = JSON.parse(window.sessionStorage.getItem("currentChapterEdit"));
//     chapter = new Chapter(chapterStr.leaderName, )
// }



