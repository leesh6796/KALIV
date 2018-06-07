var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');


var calendarSchema = new Schema({
	parentRoom: {type: Schema.Types.ObjectId, ref: 'chatRoom'},
   	eventList: [{
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
