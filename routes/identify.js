const prisma = require("../prismaClient");
const { responseFormat } = require("../utils");

const identify = require("express").Router();

identify.post("/", async (req, res) => {
  let { email, phoneNumber } = req.body; // i used let here so that i can covert no value to string;

  email = email ? email.toString() : email;
  phoneNumber = phoneNumber ? phoneNumber.toString() : phoneNumber;

  // Both email and phoneNumber are missing
  if (!email && !phoneNumber) {
    return res
      .status(429)
      .send({ message: "Please send phoneNumber or email or both." });
  }

  // If one information (email or phoneNumber) is provided
  if ((!email && phoneNumber) || (email && !phoneNumber)) {
    const find = await prisma.contact.findMany({
      where: email ? { email } : { phoneNumber },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (find.length) {
      const findAgain = await prisma.contact.findMany({
        where: {
          OR: [
            { linkedId: find[0].linkedId ? find[0].linkedId : find[0].id },
            { id: find[0].id },
            { id: find[0].linkedId ? find[0].linkedId : find[0].id },
          ],
        },
      });

      return res.send(responseFormat(findAgain));
    } else {
      const created = await prisma.contact.create({
        data: email
          ? {
              email,
              linkPrecedence: "primary",
            }
          : {
              phoneNumber,
              linkPrecedence: "primary",
            },
      });

      return res.send(responseFormat([created]));
    }
  }

  // If both email and phoneNumber are provided
  else {
    // if (email && phoneNumber)
    const find = await prisma.contact.findMany({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

     console.log(find);

    // If there's a matching contact with either email or phoneNumber
    if (find.length) {
      const firstContact = find[0];
      //if length is one
      if (find.length === 1) {
        //if either phoneNumber or email is  not matching
        const linkedId = firstContact.linkedId || firstContact.id;

        if (firstContact.email !== email || firstContact.phoneNumber !== phoneNumber ) {
          await prisma.contact.create({
            data: {
              email,
              phoneNumber,
              linkPrecedence: "secondary",
              linkedId: linkedId,
            },
          });

          const findAgain = await prisma.contact.findMany({
            where: {
              OR:[{linkedId},{id:linkedId}]
            },
          });
          return res.send(responseFormat(findAgain));
        }
      }
      
     
    } 
    // if not present create new entry
    else {
      const created = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "primary",
        },
      });
      return res.send(responseFormat([created]));
    }
  }

  
});

module.exports = identify;
