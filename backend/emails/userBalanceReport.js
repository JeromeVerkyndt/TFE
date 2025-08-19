function generateUserReport(user) {
    const toNumber = (val) => {
        if (typeof val === 'number' && Number.isFinite(val)) return val;
        if (val == null) return 0;
        const cleaned = String(val)
            .replace(/[^\d.,\-]/g, '')
            .replace(',', '.');
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
    };

    const extra = toNumber(user.extra_balance);
    const due = extra < 0 ? Math.abs(extra) : 0;

    const fmtEUR = (n) =>
        new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 2 }).format(n) + '\u00A0€';

    const textCore = due > 0
        ? `Vous devez encore payer ${fmtEUR(due)} d’extra impayé.`
        : (extra === 0
            ? `Aucun extra impayé.`
            : `Vous avez ${fmtEUR(extra)} de crédit extra. Rien à payer.`);

    const textMessage = `Bonjour ${user.first_name} ${user.last_name},

${textCore}

À bientôt !`;

    const htmlCore = due > 0
        ? `Vous devez encore payer <strong>${fmtEUR(due)}</strong> d’extra impayé.`
        : (extra === 0
            ? `Aucun extra impayé.`
            : `Vous avez <strong>${fmtEUR(extra)}</strong> de crédit extra. Rien à payer.`);

    const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #000;">
        <h2 style="margin: 0 0 12px; color: #000;">Bonjour ${user.first_name} ${user.last_name},</h2>
        <p style="color: #000;">${htmlCore}</p>
        <p style="margin-top:16px; color: #000;">À bientôt&nbsp;!</p>
    </div>
    `;

    return {
        subject: due > 0 ? `Rappel - Extra impayé (${fmtEUR(due)})` : `Rappel - Aucun extra impayé`,
        text: textMessage,
        html: htmlMessage
    };
}

module.exports = generateUserReport;
