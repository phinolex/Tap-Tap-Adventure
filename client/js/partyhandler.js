define(['jquery'], function() {

    var PartyHandler = Class.extend({
        init: function(game) {
            var self = this;

            self.game = game;
            self.members = [];
            self.toggle = false;

            $('#partyleave').click(function(event) {
                self.game.client.sendPartyLeave();
                $('#partynames').html('');
                self.show();
            });
        },

        show: function() {
            var self = this,
                party = $('#party');

            self.toggle = !self.toggle;

            if (self.toggle) {
                party.css('display', 'block');
                self.display();
            } else
                party.css('display', 'none');

        },

        confirmInvite: function(entity) {
            var self = this,
                confirmTitle = $('#partyconfirmtitle'),
                confirmYes = $('#partyconfirmyes'),
                confirmNo = $('#partyconfirmno'),
                confirm = $('#partyconfirm');

            confirmTitle.html('Join party of: ' + entity.name + '?');

            confirmYes.click(function(event) {
                self.game.client.sendPartyInvite(entity.id, 1);
                confirm.css('display', 'none');
            });

            confirmNo.click(function(event) {
                self.game.client.sendPartyInvite(entity.id, 2);
                confirm.css('display', 'none');
            });

            confirm.css('display', 'block');
        },
        
        display: function() {
            var self = this,
                tableString = '<table><tr><th>Members</th></tr>',
                partyNames = $('#partynames');
            
            if (!self.members) {
                partyNames.html('');
                return;
            }

            for (var i = 0; i < self.members; i++)
                tableString += '<tr><td>' + self.members[i] + i == 0 ? '[L]' : '' + '</td></tr>'

            tableString += '</table>';

            partyNames.html(tableString);
        },

        setMembers: function(members) {
            this.members = members;
        },

        isLeader: function(name) {
            return name == this.members[0];
        },

        isMember: function(name) {
            return this.members.indexOf(name) > -1;
        }
    });

    return PartyHandler;
});

