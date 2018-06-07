var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var calendarSchema = new Schema({
	roomID: {type: Schema.Types.ObjectId, ref: 'chatRoom'},
   	eventList: [{
   		_id: {type: Schema.Types.ObjectId},
   		name: {type: String},
   		startDate: {type: String},
   		endDate: {type: String},
   		memo: {type: String}
   	}],
});

calendarSchema.methods = {
};

calendarSchema.statics = {
};

module.exports = db.model('calendar', calendarSchema);
