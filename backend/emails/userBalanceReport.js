function generateUserReport(user) {
    let dettes = [];

    if (user.balance < 0) {
        dettes.push(`Abonnement : ${Math.abs(user.balance)}€ à payer`);
    }

    if (user.extra_balance < 0) {
        dettes.push(`Hors abonnement : ${Math.abs(user.extra_balance)}€ à payer`);
    }

    const hasDebt = dettes.length > 0;

    const textMessage = hasDebt
        ? `Bonjour ${user.first_name} ${user.last_name},

Voici un rappel de l'état de votre portefeuille :

${dettes.join('\n')}

À bientôt !`
        : `Bonjour ${user.first_name} ${user.last_name},

Votre portefeuille est à jour ✅

À bientôt !`;

    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #000;">
        <h2 style="margin: 0 0 12px; color: #000;">Bonjour ${user.first_name} ${user.last_name},</h2>
        ${
        hasDebt
            ? `
                  <p style="color: #000;">Voici un rappel de l'état de votre portefeuille :</p>
                  <ul style="margin: 8px 0 16px; padding-left: 20px; color: #000;">
                      ${dettes.map(d => `<li style="color: #000;">${d}</li>`).join('')}
                  </ul>
                `
            : `
                  <p style="color: #000;">Votre portefeuille est <strong>à jour</strong> ✅</p>
                `
    }
        <p style="margin-top:16px; color: #000;">À bientôt&nbsp;!</p>
    </div>
    `;

    return {
        subject: `Rappel - État de votre portefeuille`,
        text: textMessage,
        html: htmlMessage
    };
}

module.exports = generateUserReport;
