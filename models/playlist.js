const mongoose = require('mongoose');
const each = require('async/each');
const Song = require('./song');

const Schema = mongoose.Schema;

const playlist = new Schema({
	name: {type: String, required: true},
	description: {type: String},
	public: {type: Boolean, required: true, default: false},
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	songs: [Song.schema]
});

playlist.statics.getUsersPlaylist = function (userId, playlistId, cb) {
	return this.findOne({
		_id: playlistId,
		creator: userId
	}, (err, playlist) => {
		if (err) {
			return cb(err);
		}
		cb(null, playlist);
	});
};

playlist.statics.getUsersPlaylists = function (userId, cb) {
	return this.find({
		creator: userId
	}, (err, playlists) => {
		if (err) {
			return cb(err);
		}
		cb(null, playlists);
	});
};

playlist.statics.setUserPlaylists = function (userId, playlistsData, cb) {
	return this.remove({
		creator: userId
	}, err => {
		if (err) {
			return cb(err);
		}

		const playlistsObjects = playlistsData.map(data => {
			const playlist = new Playlist({	 // eslint-disable-line no-use-before-define
				name: data.name,
				public: data.public,
				creator: userId,
				songs: []
			});
			data.songs.forEach(song => {
				const newSong = new Song(song);
				playlist.songs.push(newSong);
			});
			return playlist;
		});

		// Const mws = playlistsObjects.map( (pl) => pl.save );

		each(playlistsObjects, (__mw, __cb) => {
			__mw.save(err => {
				if (err) {
					console.log(err);
					cb(err);
				} else {
					__cb();
				}
			});
		}, () => {
			cb(null, playlistsObjects);
		});
	});
};

playlist.statics.deletePlaylist = function (userId, playlistId, cb) {
	return this.remove({
		_id: playlistId,
		creator: userId
	}, err => {
		if (err) {
			return cb(err);
		}
		return cb(null);
	});
};

playlist.statics.addSong = function (userId, playlistId, songData, cb) {
	if (!playlistId || !songData.link || !songData.service) {
		return cb(new Error('Bad request'));
	}
	return this.findOne({
		_id: playlistId,
		creator: userId
	}, (err, playlist) => {
		if (err) {
			return cb(err);
		}
		const newSong = new Song(songData);
		playlist.songs.push(newSong);
		playlist.save(err => {
			if (err) {
				return cb(err);
			}
			cb(null, playlist);
		});
	});
};

playlist.statics.deleteSong = function (userId, playlistId, songId, cb) {
	if (!playlistId || !songId) {
		return cb(new Error('Bad request'));
	}

	this.findOne({
		_id: playlistId,
		creator: userId
	}, (err, playlist) => {
		if (err) {
			return cb(err);
		}

		playlist.songs.id(songId).remove();
		playlist.save(err => {
			if (err) {
				return cb(err);
			}
			return cb(null);
		});
	});
};

const Playlist = mongoose.model('Playlist', playlist);

module.exports = Playlist;
