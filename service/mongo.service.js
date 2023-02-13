// mongodb queries global service
// create
exports.create = async (model, body) => {
    return await model.create(body);
  };
  
  exports.upsert = async (model, filter, body) => {
    return await model.findOneAndUpdate(filter, body, {
      new: true,
      upsert: true,
      runValidators: true,
      context: "query",
      // runValidators:true,
    });
  };
  
  // find and filter
  exports.find = async (model, filter, pagination = {}, sort = {}, projection = {},populate=null) => {
    return await model.find(filter, projection,{
      populate:populate
    }).skip(pagination.skip).limit(pagination.limit).sort(sort);
  };
  
  exports.findOne = async (model, filter, projection = {},populate=null) => {
    return await model.findOne(filter, projection,{populate:populate});
  };
  
  exports.countDocuments = async (model, filter) => {
    return await model.countDocuments(filter);
  };
  
  // updates
  exports.findOneAndUpdate = async (model, filter, body) => {
    return await model.findOneAndUpdate(filter, body, { new: true });
  };
  
  exports.findOneAndUpsert = async (model, filter, body) => {
    return await model.findOneAndUpdate(filter, body, { new: true, upsert: true, runValidators: true, context: "query", setDefaultsOnInsert: true });
  };
  
  exports.updateMany = async (model, filter, body) => {
    return await model.updateMany(filter, body, { new: true });
  };
  
  // delete
  exports.findOneAndSoftDelete = async (model, filter, body) => {
    return await model.findOneAndUpdate(filter, body, { new: true });
  };
  
  exports.findOneAndHardDelete = async (model, filter) => {
    return await model.findOneAndDelete(filter);
  };
  
  exports.deleteMany = async (model, filter) => {
    return await model.deleteMany(filter);
  };
  
  // aggregation
  exports.aggregate = async (model, query) => {
    return await model.aggregate(query);
  };
  