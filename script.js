function onLoad() {
    fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getColleges')
        .then(response => response.json())
        .then(colleges => populateColleges(colleges));
}

function populateColleges(colleges) {
    var collegeSelect = document.getElementById('collegeName');
    colleges.forEach(function(college) {
        var option = document.createElement('option');
        option.value = college;
        option.text = college;
        collegeSelect.add(option);
    });
}

function login(e) {
    e.preventDefault();
    var uniqueID = document.getElementById('uniqueID').value;
    var collegeName = document.getElementById('collegeName').value;
    fetch(`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=authenticateUser&uniqueID=${uniqueID}&collegeName=${collegeName}`)
        .then(response => response.json())
        .then(data => populateDashboard(data));
}

function populateDashboard(data) {
    if (!data) {
        alert('Invalid Unique ID or College Name');
        return;
    }

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    document.getElementById('teamUniqueID').innerText = data[0];
    document.getElementById('teamCollegeName').innerText = data[1];
    document.getElementById('internshipName').innerText = data[2];
    document.getElementById('teamState').innerText = data[3];
    document.getElementById('teamName').innerText = data[4];
    document.getElementById('totalMembers').innerText = data[5];
    document.getElementById('femaleMembers').innerText = data[6];

    var submitConceptNoteBtn = document.getElementById('submitConceptNote');
    submitConceptNoteBtn.onclick = function() {
        window.open('https://forms.gle/CrcpznSxMaUYM4dL8', '_blank');
    };

    fetch(`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getFinalDeliverableLink&uniqueID=${data[0]}`)
        .then(response => response.json())
        .then(link => {
            document.getElementById('finalDeliverableButton').onclick = function() {
                window.open(link, '_blank');
            };
        });

    fetch(`https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=getTeamMembers&uniqueID=${data[0]}`)
        .then(response => response.json())
        .then(teamMembers => populateTeamMembers(teamMembers));
}

function populateTeamMembers(teamMembers) {
    var teamMembersTable = document.getElementById('teamMembersTable');
    teamMembersTable.innerHTML = '';
    var serialNumber = 1;
    for (var i = 0; i < teamMembers.length; i += 3) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${serialNumber}</td>
            <td>${teamMembers[i] || ''}</td>
            <td>${teamMembers[i + 1] || ''}</td>
            <td>${teamMembers[i + 2] || ''}</td>
            <td><a href="https://forms.gle/YG2kLvTJNuV6QpCx7" target="_blank">Submit Certificate</a></td>
        `;
        teamMembersTable.appendChild(row);
        serialNumber++;
    }
}

window.onload = onLoad;
