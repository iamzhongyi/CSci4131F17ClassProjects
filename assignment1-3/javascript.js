        var $ = function (id) {
    		return document.getElementById(id); 
    	}
    	function setlistener(){
    		var FordList = document.getElementsByClassName("Ford");
    		var MoleList = document.getElementsByClassName("Mole");
    		var FraserList = document.getElementsByClassName("Fraser");
    		var TateList = document.getElementsByClassName("Tate");
    		var KHList = document.getElementsByClassName("KH");
    		var AkList = document.getElementsByClassName("Akerman");
    		var i;
    		for(i = 0; i < FordList.length; i++){
    			FordList[i].addEventListener("mouseenter", function(){displayImg(this,"Ford")});
                FordList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}

    		for(i = 0; i < MoleList.length; i++){
    			MoleList[i].addEventListener("mouseenter", function(){displayImg(this,"Mole")});
                MoleList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}

    		for(i = 0; i < FraserList.length; i++){
    			FraserList[i].addEventListener("mouseenter", function(){displayImg(this,"Fraser")});
                FraserList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}

    		for(i = 0; i < TateList.length; i++){
    			TateList[i].addEventListener("mouseenter", function(){displayImg(this,"Tate")});
                TateList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}

    		for(i = 0; i < KHList.length; i++){
    			KHList[i].addEventListener("mouseenter", function(){displayImg(this,"KH")});
                KHList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}

    		for(i = 0; i < AkList.length; i++){
    			AkList[i].addEventListener("mouseenter", function(){displayImg(this,"Akerman")});
                AkList[i].addEventListener("mouseleave", function(){hideImg(this)});
    		}
    	}

    	function displayImg(item,place){
            //alert(item.innerHTML);
            var pic = item.getElementsByTagName("img");
	   		pic[0].style.visibility = 'visible';
    	}

        function hideImg(item){
            var pic = item.getElementsByTagName("img");
            pic[0].style.visibility = 'hidden';
        }

    	function readContent(i){
    		var cTable = $("cTable");
    		var dayRead = cTable.rows.item(i).cells;
    		var cellLength = dayRead.length;
    		var scrolStr = " ";
    		for(var j = 1; j< cellLength; j++){
    			scrolStr = scrolStr + "---" + dayRead.item(j).getElementsByTagName("p")[0].innerHTML.replace(/<br>/," ");
    		}
    		return scrolStr;
    	}
		function scrollDisplay(){
			var mydate= new Date();
			var myday = mydate.getDay();
			switch(myday)
			{
				case 0:scrolStr = "Today is Sunday, no events.";break;
				case 1:scrolStr = "Today is Monday, events: " + readContent(1);break;
				case 2:scrolStr = "Today is Tuesday events: " + readContent(2);break;
				case 3:scrolStr = "Today is Wednesday, events: " + readContent(3);break;
				case 4:scrolStr = "Today is Thursday events: " + readContent(4);break;
				case 5:scrolStr = "Today is Firday events: " + readContent(5);break;
				case 6:scrolStr = "Today is Saturday, no events.";break;
				default: scrolStr = "System error";break;
			}
			return scrolStr;
		}
		$("scroll").innerHTML = scrollDisplay();
		setlistener();

        function validateInput(){
            var evn = document.forms["myform"]['eventname'].value;
            var lct = document.forms["myform"]['location'].value;
            if( /^[a-zA-Z0-9\s]+$/.test(evn) && /^[a-zA-Z0-9\s]+$/.test(lct)) {
                return true;
            }
            else{
                alert('Event Name and Location must be alphanumeric.');
                return false;
            }
        }
        //$("twit").innerHTML = "<a class=\"twitter-timeline\"  href=\"https://twitter.com/hashtag/UMN\" data-widget-id=\"920382237677445120\">#UMN Tweets</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>"
          