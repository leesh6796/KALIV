var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var calendarSchema = new Schema({
	_id: {type: Schema.Types.ObjectId},
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

		this.eventList = this.eventList.filter(function( obj ) {
  			return obj.eventID !== eventID;
		});
		//this.eventList.pull({eventID: eventID});

		await this.save();
	}
};

calendarSchema.statics = {
};

module.exports = db.model('calendar', calendarSchema);
