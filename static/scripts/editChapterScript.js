
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

onStart();


//When the page loads:
function onStart()
{
    //Use the session storage to find the chapter the page is currently editing and store it in a Chapter object
    let chapterStr = JSON.parse(window.sessionStorage.getItem("currentChapterEdit"));
    chapter = new Chapter(chapterStr.leaderName, chapterStr.leaderEmail, chapterStr.school, chapterStr.city, 
        chapterStr.description, chapterStr.support, parseInt(chapterStr.status), parseInt(chapterStr.chapterID));
    chapter.setTeamMember(parseInt(chapterStr.teamMemberID));
    document.getElementById("heading").innerHTML = "Chapter: " + chapter.getCity();


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



