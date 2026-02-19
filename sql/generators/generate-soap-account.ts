import { generateSalt, calculateVerifier } from "../../lib/srp6";

const USERNAME = "SOAPWEBSITE";
const PASSWORD = "b8Lnu&08z2vEl4JJ";

const salt = generateSalt();
const verifier = calculateVerifier(USERNAME, PASSWORD, salt);

const saltHex = Buffer.from(salt).toString("hex");
const verifierHex = Buffer.from(verifier).toString("hex");

console.log(`-- SOAP account for website shop delivery
-- Database: auth

INSERT INTO \`account\` (\`username\`, \`salt\`, \`verifier\`, \`email\`, \`expansion\`)
VALUES ('${USERNAME}', X'${saltHex}', X'${verifierHex}', 'soap@lordaeron.local', 2);

INSERT INTO \`account_access\` (\`AccountID\`, \`SecurityLevel\`, \`RealmID\`, \`Comment\`)
VALUES ((SELECT \`id\` FROM \`account\` WHERE \`username\` = '${USERNAME}'), 3, -1, 'Website SOAP delivery');
`);
