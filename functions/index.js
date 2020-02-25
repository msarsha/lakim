const functions = require('firebase-functions');
const admin = require('firebase-admin');
const format = require('date-fns/format');
const subMinutes = require('date-fns/subMinutes')

admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


// {appointment, swapWith}
exports.addSwap = functions
		.firestore
		.document('swaps/{uid}')
		.onCreate(async (doc) => {
			const data = doc.data();
			console.log(data);
		});

exports.signupNotification = functions
		.firestore
		.document('user-profiles/{uid}')
		.onCreate(async (doc) => {
			const data = doc.data();

			const notificationPayload = {
				notification: {
					title: 'לקוח חדש',
					body: ` נרשם כלקוח חדש. לחץ כדי לאשר${data.name}`
				}
			};

			return sendNotificationToAdmins(notificationPayload);
		});

exports.addAppointment = functions
		.firestore
		.document('appointments/{aid}')
		.onCreate(async (snap, context) => {
			const aid = snap.id;
			const uid = snap.data().uid;
			const appointmentData = snap.data();

			const userProfile = await db.doc(`user-profiles/${uid}`).get();
			const userProfileData = userProfile.data();
			const appointments = userProfileData.appointments ? userProfileData.appointments : {};

			appointments[aid] = true;

			await db.doc(`user-profiles/${uid}`).update({
				appointments
			});

			const appointmentDate = subMinutes(new Date(appointmentData.date), appointmentData.timeZoneOffset || 0);
			const formattedDate = format(appointmentDate, 'dd/MM/yyyy');
			const formattedHour = format(appointmentDate, 'HH:mm');
			const notificationPayload = {
				notification: {
					title: 'נקבע תור חדש',
					body: ` ${userProfileData.name} תיאם תור חדש בתאריך: ${formattedDate} בשעה ${formattedHour}`
				}
			};

			return sendNotificationToAdmins(notificationPayload);
		});


exports.cancelAppointment = functions
		.firestore
		.document('appointments/{aid}')
		.onDelete(async (snap, context) => {
			const aid = snap.id;
			const uid = snap.data().uid;
			const appointmentData = snap.data();

			const userProfile = await db.doc(`user-profiles/${uid}`).get();
			const userProfileData = userProfile.data();
			const appointments = userProfileData.appointments ? userProfileData.appointments : {};

			delete appointments[aid];

			await db.doc(`user-profiles/${uid}`).update({
				appointments
			});

			const appointmentDate = subMinutes(new Date(appointmentData.date), appointmentData.timeZoneOffset || 0);
			const formattedDate = format(appointmentDate, 'dd/MM/yyyy');
			const formattedHour = format(appointmentDate, 'HH:mm');
			const notificationPayload = {
				notification: {
					title: 'תור בוטל',
					body: ` ${userProfileData.name} ביטל תור בתאריך: ${formattedDate} בשעה ${formattedHour}`
				}
			};

			return sendNotificationToAdmins(notificationPayload);
		});


async function sendNotificationToAdmins(payload) {
	const adminsQuery = db.collection('user-profiles')
			.where('isAdmin', '==', true);

	const adminDocs = await adminsQuery.get();
	let tokens = [];

	adminDocs.forEach((doc) => {
		tokens = tokens.concat(doc.data().devices);
	});

	return admin.messaging().sendToDevice(tokens, payload);
}
