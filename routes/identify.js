const identify = require("express").Router();

identify.post("/", async (req, res) => {
  const { email, phoneNumber } = req.body;

  // if Both email and phoneNumber are missing
  if (!email && !phoneNumber) {
    return res.status(429).send({ message: "Please send phoneNumber or email or both." });
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

  
});

module.exports = identify;
