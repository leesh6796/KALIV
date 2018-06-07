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
   		memo: {type: String}
   	}],
});

calendarSchema.methods = {
	addEvent: async function(eventID, name, startDate, endDate, memo)
	{
		let newEvent = {
			eventID: eventID,
			name: name,
			startDate: startDate,
			endDate: endDate,
			memo: memo
		};

		this.eventList.push(newEvent);
		await this.save();
	},
	removeEvent: async function(eventID)
	{
		this.eventList.pull({eventID: eventID});
		await this.save();
	}
};

calendarSchema.statics = {
};

module.exports = db.model('calendar', calendarSchema);
