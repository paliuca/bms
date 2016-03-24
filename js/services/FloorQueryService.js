'use strict'; 
module.exports = ["DbService", "$q", function(DbService, $q) {

	var FloorQueryService = function() {
		this.DbService_ = DbService;
		this.db = null;
		this.floorSchema = null;this.roomSchema = null;
	  	this.whenInitialized_ = this.init_().then(
			function(db) {
	        return db;
		}.bind(this));
	};
	
	FloorQueryService.prototype.init_ = function() {
		var self = this;
		return this.DbService_.get().then(function(db) {
			self.db = db;		
			self.roomSchema = db.getSchema().table('rooms').as('room');
			self.floorSchema = db.getSchema().table('floors').as('floor');
			self.houseSchema = db.getSchema().table('houses').as('house');
			return db;
		});	
	};

	FloorQueryService.prototype.find = function(id) {
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			self.db.select().from(self.floorSchema)
			.leftOuterJoin(self.houseSchema, self.floorSchema.house_id.eq(self.houseSchema.id))
			.where(self.floorSchema.id.eq(id)).exec().then(function(response) {
				deferred.resolve(response[0]);
			});
		})		
		return deferred.promise;
	};

	FloorQueryService.prototype.all = function() {
		var deferred = $q.defer();
		var self = this;
		this.buildQuery_().then(function(query) {
			self.sqlQuery = query.toSql();
			return query.exec();
		}).then(function(results) {			
			deferred.resolve(results);
		});	
		return deferred.promise;
	};


	FloorQueryService.prototype.findByHouseId = function(houseId){
		var deferred = $q.defer();
		var self = this;
		this.buildQuery_().then(function(query) {
			self.sqlQuery = query.toSql();
			if(houseId){
				query.where(self.floorSchema.house_id.eq(houseId)).orderBy(self.floorSchema.ordered, lf.Order.ASC);
			}else{
				query.where(self.floorSchema.house_id.isNull()).orderBy(self.floorSchema.ordered, lf.Order.ASC);
			}
			return query.exec();
		}).then(function(results) {			
			deferred.resolve(results);
		});	
		return deferred.promise;
	}

	FloorQueryService.prototype.buildQuery_ = function() {
		var deferred = $q.defer();
		var self = this;
	  	this.DbService_.get().then(function(db) {
	  		self.db = db;
			self.floorSchema = db.getSchema().table('floors').as('floor');
			var query = self.db.select().from(self.floorSchema);
			deferred.resolve(query);
		})
		return deferred.promise;
	};

	FloorQueryService.prototype.insertHouseFloor = function(floorName) {
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			self.db.select(lf.fn.count(self.floorSchema.id)).from(self.floorSchema)
				.where(lf.op.and(
        			self.floorSchema.name.eq(floorName),
        			self.floorSchema.house_id.isNull()))
				.exec().then(function(response) {
					if(response[0]['COUNT(id)']){
						deferred.reject(null);
					}else{
						var row = self.floorSchema.createRow({
							'name': floorName
						});
						self.db.insertOrReplace().into(self.floorSchema).values([row]).exec().then(function(response){
							deferred.resolve(response[0]);
						});
					}
			});			
		})
		return deferred.promise;
	};

	FloorQueryService.prototype.insertComplexFloor = function(floorName, houseId) {
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			self.db.select(lf.fn.count(self.floorSchema.id)).from(self.floorSchema)
				.where(lf.op.and(
        			self.floorSchema.name.eq(floorName),
        			self.floorSchema.house_id.eq(houseId)))	
				.exec().then(function(response) {
				if(response[0]['COUNT(id)']){
					deferred.reject(null);
				}else{
					var row = self.floorSchema.createRow({
						'name': floorName,
						'house_id':houseId
					});					
					self.db.insertOrReplace().into(self.floorSchema).values([row]).exec().then(function(response){
						deferred.resolve(response[0]);					
					});
				}
			});			
		})
		return deferred.promise;
	};


	FloorQueryService.prototype.update = function(floors) {
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			var rows = floors.map(function(floor){
				return self.floorSchema.createRow(floor);
			})
			self.db.insertOrReplace().into(self.floorSchema).values(rows).exec().then(function(response){
				deferred.resolve(response);
			});			
		})
		return deferred.promise;		
	};

	FloorQueryService.prototype.delete = function(floorId) {
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			self.db.select(lf.fn.count(self.roomSchema.id)).from(self.roomSchema).where(self.roomSchema.floor_id.eq(floorId)).exec().then(function(response){
				if(response[0]['COUNT(id)']){
					deferred.reject(null);
				}else{
					self.db.delete().from(self.floorSchema).where(self.floorSchema.id.eq(floorId)).exec().then(function(response){
						deferred.resolve(null);
					});
				}
			})
		})
		return deferred.promise;		
	};


	FloorQueryService.prototype.clear = function(){
		var deferred = $q.defer();
		var self = this;
		this.get_().then(function(){
			self.db.delete().from(self.floorSchema).exec().then(function(response){
				deferred.resolve(response);
			})
		})
		return deferred.promise;
	}

	FloorQueryService.prototype.get_ = function() {
	  return this.whenInitialized_;
	};	

    return new FloorQueryService();
}];