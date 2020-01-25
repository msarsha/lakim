const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.signupNotification = functions
		.firestore
		.document('user-profiles/{uid}')
		.onCreate(async (doc) => {
			const data = doc.data();

			const adminsQuery = db.collection('user-profiles')
					.where('isAdmin', '==', true);

			const adminDocs = await adminsQuery.get();
			let tokens = [];

			adminDocs.forEach((doc) => {
				tokens = tokens.concat(doc.data().devices);
			});

			const notificationPayload = {
				notification: {
					title: 'לקוח חדש',
					body: 'לקוח חדש נרשם! נא לאשר אותו'
				}
			};

			return admin.messaging().sendToDevice(tokens, notificationPayload);
		});

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
