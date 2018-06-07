var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var calendarSchema = new Schema({
	roomID: {type: Schema.Types.ObjectId, ref: 'chatRoom'},
   	eventList: [{
   		eventID: {type: String},
   		name: {type: String},
   		startDate: {type: String},
   		endDate: {type: String},
   		allDay: {type: Boolean},
   	}],
});

calendarSchema.methods = {
	addEvent: async function(eventID, name, startDate, endDate, allDay)
	{
		let newEvent = {
			eventID: eventID,
			name: name,
			startDate: startDate,
			endDate: endDate,
			allDay: allDay
		};

		this.eventList.push(newEvent);
		await this.save();
	},
	removeEvent: async function(eventID)
	{
		console.log(eventID);
		this.update({eventList.$.eventID: eventID}, {$pull : {eventList : {eventID: eventID}}});
		await this.save();
		console.log(this.eventList);
	}
};

calendarSchema.statics = {
};

module.exports = db.model('calendar', calendarSchema);
