var chapterStr = JSON.parse(window.sessionStorage.getItem("currentChapterView"));
loadData();

function loadData()
{
    document.getElementById("heading").innerHTML = chapterStr.city;
    document.getElementById("leaderName").innerHTML = chapterStr.leaderName;
    document.getElementById("leaderEmail").innerHTML = chapterStr.leaderEmail;
    document.getElementById("school").innerHTML = chapterStr.school;
    document.getElementById("description").innerHTML = chapterStr.description;
    document.getElementById("support").innerHTML = chapterStr.support;

    let status = parseInt(chapterStr.status);
    if(status == 0)
    {
        document.getElementById("status").innerHTML = "Applied";
    } else if(status == 1)
    {
        document.getElementById("status").innerHTML = "Approved";
    }else if(status == 2)
    {
        document.getElementById("status").innerHTML = "Started";
    }else if(status == 3)
    {
        document.getElementById("status").innerHTML = "Ended";
    }

    let teamMembersStr = JSON.parse(window.localStorage.getItem("team"));
    let memberID = parseInt(chapterStr.teamMemberID);
    document.getElementById("teamMember").innerHTML = teamMembersStr[memberID - 1].name;
    
}

