const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.addAppointment = functions
		.firestore
		.document('appointments/{aid}')
		.onCreate(async (snap, context) => {
			const aid = snap.id;
			const uid = snap.data().uid;

			const userProfile = await db.doc(`user-profiles/${uid}`).get();
			const appointments = userProfile.data().appointments ? userProfile.data().appointments : {};

			appointments[aid] = true;

			return db.doc(`user-profiles/${uid}`).update({
				appointments
			});
		});


exports.cancelAppointment = functions
		.firestore
		.document('appointments/{aid}')
		.onDelete(async (snap, context) => {
			const aid = snap.id;
			const uid = snap.data().uid;

			const userProfile = await db.doc(`user-profiles/${uid}`).get();
			const appointments = userProfile.data().appointments ? userProfile.data().appointments : {};

			delete appointments[aid];

			return db.doc(`user-profiles/${uid}`).update({
				appointments
			});
		});
