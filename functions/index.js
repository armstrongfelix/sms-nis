const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { logger } = require("firebase-functions");

admin.initializeApp();

const db = admin.firestore();

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < 10; i++) {
    const array = new Uint32Array(1);
    require("crypto").getRandomValues(array);
    password += chars[array[0] % chars.length];
  }
  return password;
}

exports.createAdmin = onCall(async (request) => {
  const { zone, formation, role, email } = request.data;

  if (!request.auth) {
    throw new Error("Authentication required. You must be logged in to register an admin.");
  }

  const password = generatePassword();

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await db.collection("admins").doc(userRecord.uid).set({
      zone,
      formation,
      role,
      email,
    });

    logger.info(`Admin created: ${email} (${userRecord.uid})`);

    return { success: true, password };
  } catch (error) {
    logger.error("Failed to create admin", error);
    throw new Error(error.message);
  }
});
