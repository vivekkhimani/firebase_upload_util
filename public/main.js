window.onload = function(){
	document.getElementById("numObjects").addEventListener("change", totalVal);
	document.getElementById("createAcct").addEventListener("click",updateDB);
};

function updateDB(){
	const first_name = document.getElementById("fNameCA").value;
	const last_name = document.getElementById("lNameCA").value;
	const link1 = document.getElementById("gDrive1").value;
	const descr1 = document.getElementById("description1").value;
	const link2 = document.getElementById("gDrive2").value;
	const descr2 = document.getElementById("description2").value;


	const final_url = "https://ash-initiative.firebaseapp.com/update_db/?first_name="+first_name+"&last_name="+last_name+"&GDrive1="+link1+"&description1="+descr1+"&GDrive2="+link2+"&description2="+descr2;
	//const final_url = "http://localhost:5000/update_db/?first_name="+first_name+"&last_name="+last_name+"&GDrive1="+link1+"&description1="+descr1+"&GDrive2="+link2+"&description2="+descr2;

	$.ajax({
		url: final_url,
		type: 'GET',
		success: function(resp,msg){
			console.log("data sent to the server.")
			console.log(resp);
			if (resp == "Received."){
				console.log("SUCCESS");
				document.getElementById("blank_success").style.visibility = "visible";
				//window.location.replace("www.ashinitiative.com");
			}
			else if (resp == "Get Out"){
				console.log("Hmm. Seems like you are trying to bypass the email verification step.")
				document.getElementById("blank_failure").style.visibility = "visible";
			}
		}

	})
}


function totalVal() {
    var x = document.getElementById("numObjects").value;
    if (x == "1") {
        var mainDiv = document.getElementById("additionalBoxes");
        document.getElementById("label1a").style.visibility = "visible";
        document.getElementById("gDrive1").style.visibility = "visible";
        document.getElementById("label1b").style.visibility = "visible";
        document.getElementById("description1").style.visibility = "visible";
    }
    else if (x == "2") {
        document.getElementById("label1a").style.visibility = "visible";
        document.getElementById("gDrive1").style.visibility = "visible";
        document.getElementById("label1b").style.visibility = "visible";
        document.getElementById("description1").style.visibility = "visible";
        document.getElementById("label2a").style.visibility = "visible";
        document.getElementById("gDrive2").style.visibility = "visible";
        document.getElementById("label2b").style.visibility = "visible";
        document.getElementById("description2").style.visibility = "visible";
    }
}