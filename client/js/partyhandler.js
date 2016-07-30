define(['jquery'], function() {
  var PartyHandler = Class.extend({
    init: function(game) {
	this.game = game;
	this.toggle = false;
	this.members = [];
	//$('#partyconfirm').css('display', 'none');
	var self = this;    
	$('#partyleave').click(function(event){
	    self.game.client.sendPartyLeave();
	    $('#partynames').html("");
	    self.show();
	});            
    },

    inviteconfirm: function (invitee)
    {
    	    var self = this;
    	    
    	    $('#partyconfirmtitle').html("Party " + invitee.name + "?");
    	   
	    $('#partyconfirmyes').click(function(event){
		    self.game.client.sendPartyInvite(invitee.id, 1);
		    $('#partyconfirm').css('display', 'none');
	    });
	    $('#partyconfirmno').click(function(event){
		    self.game.client.sendPartyInvite(invitee.id, 2);
		    $('#partyconfirm').css('display', 'none');
	    });
	     $('#partyconfirm').css('display', 'block');
    },

    show: function() {
        this.toggle = !this.toggle;
    	if (this.toggle)
    	{
            $('#party').css('display', 'block');
            this.display();
        }
        else
        {
            $('#party').css('display', 'none');
        }
    },
    setMembers: function(members){
      this.members = members;
      //log.info("this.members[0]="+this.members[0]);
    },
    
    display: function () {
      if (!this.members)
      {
      	  $('#partynames').html("");
          return;
      }

      var htmlStr = "<table><tr><th>Name</th></tr>";
      htmlStr += "<tr><td>" + this.members[0] + " (L)</td></tr>";
      for(var i=1; i < this.members.length; ++i){
          htmlStr += "<tr><td>" + this.members[i] + "</td></tr>";
      }
      htmlStr += "</table>";
      $('#partynames').html(htmlStr);
    	    
    },
    
    isLeader: function (name) {
    	//log.info("name="+name+",this.members[0]="+this.members[0]);
    	return name === this.members[0];	    
    },
    
    isMember: function (name) {
    	return (this.members.indexOf(name) > -1);	    
    }
  });
  return PartyHandler;
});

