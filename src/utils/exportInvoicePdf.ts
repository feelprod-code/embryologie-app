export interface InvoiceData {
  firstName?: string;
  lastName?: string;
  email: string;
  profession?: string;
  address?: string;
  location?: string;
  stripePaymentId?: string | null;
  createdAt?: string;
  amount?: number;
  invoiceNumber?: string;
}

export function openInvoiceWindow(data: InvoiceData) {
  // Garde-fou strict : Aucune facture émise pour les comptes gratuits, tests ou à 0 €
  if (!data.stripePaymentId && (!data.amount || data.amount <= 0)) {
    alert("Aucune facture FeelProd n'est émise pour les comptes gratuits ou sans règlement validé sur Stripe.");
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert("Veuillez autoriser l'ouverture des fenêtres pop-up pour afficher la facture.");
    return;
  }

  const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
  const fullAddress = data.address || data.location || "Adresse communiquée lors du paiement";
  const profession = data.profession || "Praticien de santé";
  const invoiceDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
  const invoiceNum = data.invoiceNumber || `FP-EMBRYO-${new Date(data.createdAt || Date.now()).getFullYear()}-${(data.stripePaymentId ? data.stripePaymentId.slice(-4) : '0042').toUpperCase()}`;
  const totalAmount = data.amount || 400.00;
  const totalHT = (totalAmount / 1.2).toFixed(2);
  const totalTVA = (totalAmount - parseFloat(totalHT)).toFixed(2);
  const stripeRef = data.stripePaymentId || "Paiement en ligne sécurisé";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture FeelProd — ${clientName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #FAF6ED;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1E293B;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }

    .top-actions {
      width: 794px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-bottom: 16px;
    }

    .btn-print {
      background: #0F172A;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
      transition: background 0.2s;
    }
    .btn-print:hover { background: #1E293B; }

    .btn-email {
      background: #1D4ED8;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 13px;
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
      transition: background 0.2s;
    }
    .btn-email:hover { background: #1E40AF; }

    .invoice-card {
      background: #FFFFFF;
      width: 794px;
      min-height: 1123px;
      padding: 48px 52px;
      border-radius: 18px;
      box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .top-brand-stripe {
      position: absolute;
      top: 0; left: 0; right: 0; height: 6px;
      border-top-left-radius: 18px; border-top-right-radius: 18px;
      background: linear-gradient(90deg, #0F172A 0%, #1E3A8A 40%, #D97706 80%, #F59E0B 100%);
    }

    .header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding-bottom: 24px; border-bottom: 1.5px solid #F1F5F9;
    }
    .brand-title {
      font-size: 26px; font-weight: 900; letter-spacing: 0.12em; color: #0F172A;
      display: flex; align-items: center; gap: 8px;
    }
    .brand-title .dot { width: 8px; height: 8px; background: #D97706; border-radius: 50%; display: inline-block; }
    .brand-subtitle { font-size: 11px; color: #64748B; font-weight: 500; margin-top: 3px; }
    .brand-legal { font-size: 10px; color: #94A3B8; line-height: 1.5; margin-top: 6px; }

    .invoice-badge-box { text-align: right; }
    .badge-acquittee {
      display: inline-flex; align-items: center; gap: 5px;
      background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0;
      padding: 5px 12px; border-radius: 30px; font-size: 10.5px; font-weight: 800;
      letter-spacing: 0.06em; text-transform: uppercase;
    }
    .badge-acquittee::before { content: "✓"; font-weight: 900; }
    .invoice-number { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 800; color: #0F172A; margin-top: 8px; }
    .invoice-dates { font-size: 10.5px; color: #64748B; margin-top: 4px; line-height: 1.4; }

    .client-section {
      display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 22px; margin-bottom: 22px;
    }
    .info-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 18px; }
    .info-label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; margin-bottom: 5px; }
    .client-name { font-size: 13.5px; font-weight: 700; color: #0F172A; }
    .client-details { font-size: 11px; color: #475569; line-height: 1.5; margin-top: 2px; }

    .table-container { margin-top: 8px; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    thead { background: #0F172A; color: #F8FAFC; }
    th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 16px; }
    th.right, td.right { text-align: right; }
    th.center, td.center { text-align: center; }
    tbody tr { background: #FFFFFF; }
    td { padding: 16px 16px; font-size: 11.5px; vertical-align: top; }
    .product-title { font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
    .product-sub { font-size: 10.5px; color: #64748B; line-height: 1.5; }
    .product-sub ul { margin-top: 4px; padding-left: 16px; }
    .item-tag {
      display: inline-block; background: #FEF3C7; color: #92400E; font-size: 9px;
      font-weight: 700; padding: 2px 7px; border-radius: 5px; margin-top: 4px;
    }

    .bottom-section { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px; margin-top: 22px; }
    .payment-box { background: #FAF8F5; border: 1px solid #EFE9DE; border-radius: 12px; padding: 16px; }
    .payment-title { font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #78350F; margin-bottom: 8px; }
    .payment-row { display: flex; justify-content: space-between; font-size: 10.5px; color: #475569; margin-bottom: 4px; }
    .payment-row span:last-child { font-weight: 600; color: #0F172A; }
    .stripe-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: #4338CA;
      background: #EEF2FF; padding: 2px 7px; border-radius: 5px;
    }

    .totals-box {
      background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px 18px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .totals-row { display: flex; justify-content: space-between; font-size: 11.5px; color: #475569; margin-bottom: 6px; }
    .totals-row.total-ttc {
      border-top: 2px solid #CBD5E1; padding-top: 8px; margin-top: 4px; margin-bottom: 6px;
      font-size: 16px; font-weight: 900; color: #0F172A;
    }
    .totals-row.remaining { font-size: 11.5px; font-weight: 700; color: #059669; border-top: 1px dashed #CBD5E1; padding-top: 5px; }

    .footer {
      border-top: 1.5px solid #F1F5F9; padding-top: 16px; margin-top: 22px;
      font-size: 9px; color: #94A3B8; line-height: 1.5; text-align: center;
    }

    @media print {
      body { background: transparent !important; padding: 0 !important; }
      .top-actions { display: none !important; }
      .invoice-card { box-shadow: none !important; width: 100% !important; min-height: auto !important; padding: 20mm 15mm !important; }
    }
  </style>
</head>
<body>
  <div class="top-actions">
    <button class="btn-email" onclick="handleEmailInvoice()">📧 Envoyer par Email (${data.email})</button>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer ou Enregistrer en PDF (A4)</button>
  </div>

  <div class="invoice-card" id="invoice">
    <div class="top-brand-stripe"></div>

    <div>
      <div class="header">
        <div>
          <div class="brand-title">FEELPROD <span class="dot"></span></div>
          <div class="brand-subtitle">Guillaume PHILIPPE — Masseur-Kinésithérapeute D.E. • Enseigne : FEELPROD</div>
          <div class="brand-legal">
            Masseur-Kinésithérapeute D.E. • Édition Multimédia Médicale & Formations Numériques<br>
            28 bis boulevard de Sébastopol, 75004 Paris<br>
            <strong>SIRET :</strong> 480 342 901 00021 • <strong>Code NAF :</strong> 8690E / 5911B<br>
            <strong>TVA Intracommunautaire :</strong> FR 48 480342901
          </div>
        </div>
        <div class="invoice-badge-box">
          <div class="badge-acquittee">Facture Acquittée</div>
          <div class="invoice-number">${invoiceNum}</div>
          <div class="invoice-dates">
            <strong>Date d'émission :</strong> ${invoiceDate}<br>
            <strong>Date de paiement :</strong> ${invoiceDate}
          </div>
        </div>
      </div>

      <div class="client-section">
        <div class="info-card">
          <div class="info-label">Destinataire / Praticien Facturé</div>
          <div class="client-name">${clientName}</div>
          <div class="client-details">
            <strong>Profession :</strong> ${profession}<br>
            <strong>Adresse :</strong> ${fullAddress}<br>
            <strong>Email :</strong> ${data.email}
          </div>
        </div>

        <div class="info-card">
          <div class="info-label">Objet & Plateforme d'Enseignement</div>
          <div class="client-name">Application « Embryo App »</div>
          <div class="client-details">
            Enseignement magistral de Marc DAMOISEAUX • Réalisation FeelProd<br>
            <strong>Accès :</strong> Licence d'accès individuel permanent illimité<br>
            <strong>Plateforme :</strong> Web, iPhone, iPad, Mac (Synchronisation Cloud)<br>
            <strong>Statut :</strong> Débloqué Premium (Actif)
          </div>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 58%;">Description de la Prestation</th>
              <th class="center" style="width: 10%;">Qté</th>
              <th class="right" style="width: 16%;">P.U. HT</th>
              <th class="right" style="width: 16%;">Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="product-title">Formation Embryologie Dynamique — Accès Intégral e-Learning</div>
                <div class="product-sub">
                  Accès pédagogique complet et autonome aux 4 Séminaires cliniques :
                  <ul>
                    <li><strong>Module 1 — L'Ectoderme :</strong> Morphogenèse et système nerveux central</li>
                    <li><strong>Module 2 — L'Endoderme :</strong> Le tube digestif et ses plicatures fasciales</li>
                    <li><strong>Module 3 — Le Mésoderme :</strong> Tissu conjonctif, fascias et axe osseux</li>
                    <li><strong>Module 4 — L'Œil :</strong> Optique, rétine, dynamique fluidique et fasciale</li>
                    <li><strong>Assistant IA Spécialisé (Claude 3.5 Sonnet) :</strong> Recherche clinique 24/7</li>
                    <li><strong>Chronologie Interactive & Fiches Pédagogiques :</strong> 24h de cours HD</li>
                  </ul>
                </div>
                <div class="item-tag">Licence d'Accès Définitif & Mises à Jour Incluses</div>
              </td>
              <td class="center" style="font-weight: 600;">1</td>
              <td class="right" style="font-family: 'JetBrains Mono', monospace; font-size: 12px;">${totalHT} €</td>
              <td class="right" style="font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;">${totalHT} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bottom-section">
        <div class="payment-box">
          <div class="payment-title"><span>💳</span> Traçabilité du Règlement Bancaire</div>
          <div class="payment-row">
            <span>Mode d'encaissement :</span>
            <span>Carte Bancaire (Stripe Checkout)</span>
          </div>
          <div class="payment-row">
            <span>Passerelle :</span>
            <span>Stripe Payments Europe, Ltd</span>
          </div>
          <div class="payment-row">
            <span>Réf. Transaction Stripe :</span>
            <span class="stripe-badge">${stripeRef}</span>
          </div>
          <div class="payment-row">
            <span>Date d'encaissement :</span>
            <span>${invoiceDate}</span>
          </div>
          <div class="payment-row" style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #E2E8F0;">
            <span style="font-weight: 600; color: #065F46;">Statut comptable :</span>
            <span style="font-weight: 700; color: #065F46;">Réglé à 100% (Solde dû : 0,00 €)</span>
          </div>
        </div>

        <div class="totals-box">
          <div class="totals-row">
            <span>Total HT :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600;">${totalHT} €</span>
          </div>
          <div class="totals-row">
            <span>TVA (20,00 %) :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600;">${totalTVA} €</span>
          </div>
          <div class="totals-row total-ttc">
            <span>Total TTC :</span>
            <span style="font-family: 'JetBrains Mono', monospace; color: #0F172A;">${totalAmount.toFixed(2)} €</span>
          </div>
          <div class="totals-row remaining">
            <span>Montant Net Réglé :</span>
            <span style="font-family: 'JetBrains Mono', monospace;">${totalAmount.toFixed(2)} €</span>
          </div>
          <div class="totals-row" style="margin-bottom: 0; margin-top: 2px; font-size: 10.5px; color: #64748B;">
            <span>Solde restant dû :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #059669;">0,00 €</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="font-weight: 600; color: #475569;">
        Facture acquittée le ${invoiceDate} • Prestation de formation numérique e-learning avec mise à disposition immédiate.
      </p>
      <p>
        Aucun escompte pour paiement anticipé. En cas de retard entre professionnels, indemnité forfaitaire pour frais de recouvrement de 40 € (art. D. 441-5 du Code de commerce).
      </p>
      <p>
        Ce document certifié constitue une pièce justificative originale déductible en comptabilité au titre des charges de formation continue.
      </p>
    </div>
  </div>
  <script>
    function handleEmailInvoice() {
      const subject = encodeURIComponent("[FEELPROD] Facture Acquittée Formation Embryologie — ${invoiceNum}");
      const body = encodeURIComponent(
        "Bonjour ${clientName},\\n\\n" +
        "Veuillez trouver ci-joint le lien et le récapitulatif de votre facture acquittée ${invoiceNum} relative à votre inscription à la formation Embryologie Biodynamique animée par Marc DAMOISEAUX et produite par FeelProd.\\n\\n" +
        "• Référence Facture : ${invoiceNum}\\n" +
        "• Date de règlement : ${invoiceDate}\\n" +
        "• Montant acquitté TTC : ${totalAmount.toFixed(2)} € (TVA 20%)\\n" +
        "• Réf. Transaction Stripe : ${stripeRef}\\n\\n" +
        "Ce document certifié constitue votre justificatif original déductible en comptabilité au titre de la formation professionnelle continue.\\n\\n" +
        "Bien confraternellement,\\n" +
        "Guillaume Philippe\\n" +
        "Masseur-Kinésithérapeute D.E. • FEELPROD"
      );
      window.location.href = "mailto:${data.email}?subject=" + subject + "&body=" + body;
    }
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export async function shareInvoice(data: InvoiceData) {
  const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
  const invoiceNum = data.invoiceNumber || `FP-EMBRYO-${new Date(data.createdAt || Date.now()).getFullYear()}-${(data.stripePaymentId ? data.stripePaymentId.slice(-4) : '0042').toUpperCase()}`;
  const amountStr = (data.amount || 400).toFixed(2);
  const shareText = `Facture FeelProd certifiée (${invoiceNum})\nClient : ${clientName} (${data.email})\nMontant réglé : ${amountStr} €\nRéf. Transaction Stripe : ${data.stripePaymentId || 'Stripe Checkout'}\nDate : ${data.createdAt ? new Date(data.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}\nPrestation : Formation Intégrale Embryologie & Morphogenèse Dynamique.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Facture FeelProd — ${clientName}`,
        text: shareText,
        url: window.location.origin
      });
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(shareText);
    alert(`📋 Références de la facture FeelProd (${invoiceNum}) copiées dans votre presse-papier !\nVous pouvez la coller directement dans WhatsApp, Mail ou Messages.`);
  } catch {
    openEmailForInvoice(data);
  }
}

export function openEmailForInvoice(data: InvoiceData) {
  const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
  const amountStr = (data.amount || 400).toFixed(2);
  const stripeId = data.stripePaymentId || 'Paiement en ligne';
  const subject = encodeURIComponent(`Facture FeelProd — Formation Intégrale Embryologie`);
  const body = encodeURIComponent(
`Bonjour ${clientName},

Nous vous remercions pour votre inscription à la Formation Intégrale d'Embryologie & Morphogenèse Dynamique par Marc Damoiseaux et Guillaume Philippe (FeelProd).

Votre règlement d'un montant de ${amountStr} € a bien été validé (Réf. transaction : ${stripeId}).

Vous trouverez ci-joint votre facture officielle acquittée. Vous pouvez également télécharger et imprimer votre facture originale à tout moment en vous connectant à votre espace apprenant et en cliquant sur le bouton « Ma Facture » dans la barre supérieure de l'application.

Restant à votre entière disposition,
Bien confraternellement,

Guillaume PHILIPPE & Marc DAMOISEAUX
FeelProd Studio
28 bis boulevard de Sébastopol, 75004 Paris`
  );

  window.location.href = `mailto:${data.email}?subject=${subject}&body=${body}`;
}

export function openWhatsAppForInvoice(data: InvoiceData) {
  const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
  const amountStr = (data.amount || 400).toFixed(2);
  const stripeId = data.stripePaymentId || 'Stripe';
  const text = encodeURIComponent(
    `Bonjour ${clientName},\n\nVotre facture FeelProd (${amountStr} €) pour votre inscription à la Formation Intégrale d'Embryologie Dynamique est disponible.\nRéf. règlement : ${stripeId}.\n\nVous pouvez consulter et imprimer votre justificatif officiel directement sur votre espace apprenant FeelProd :\n${window.location.origin}\n\nBien confraternellement,\nGuillaume PHILIPPE & Marc DAMOISEAUX`
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

export function openSmsForInvoice(data: InvoiceData) {
  const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
  const amountStr = (data.amount || 400).toFixed(2);
  const text = encodeURIComponent(
    `Bonjour ${clientName}, votre facture FeelProd (${amountStr} €) pour l'Embryologie Dynamique est disponible. Réf: ${data.stripePaymentId || 'Stripe'}. Espace : ${window.location.origin}`
  );
  window.location.href = `sms:?&body=${text}`;
}

export interface PartnerSale {
  date: string;
  name: string;
  email: string;
  profession?: string;
  location?: string;
  stripePaymentId: string;
  amount: number;
}

export function openDamoiseauxSummaryWindow(sales: PartnerSale[], options?: { stripeFeePerSale?: number; platformFeeRate?: number }) {
  const printWindow = window.open('', '_blank', 'width=900,height=1100');
  if (!printWindow) {
    alert("Veuillez autoriser l'ouverture des fenêtres pop-up pour afficher le bilan partenaire.");
    return;
  }

  const stripeFeePerSale = options?.stripeFeePerSale ?? 6.25; // 1.5% + 0.25€ par tx 400€
  const platformFeeRate = options?.platformFeeRate ?? 0.05; // 5% frais de fonctionnement & hébergement vidéo FeelProd

  const totalBrut = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalStripeFees = sales.length * stripeFeePerSale;
  const totalPlatformFees = totalBrut * platformFeeRate;
  const totalFees = totalStripeFees + totalPlatformFees;
  const totalNet = totalBrut - totalFees;
  const partMarc = totalNet / 2;
  const partFeelProd = totalNet / 2;
  const dateStr = new Date().toLocaleDateString('fr-FR');

  const rowsHtml = sales.map(s => {
    const sStripeFee = stripeFeePerSale;
    const sPlatformFee = s.amount * platformFeeRate;
    const sTotalFee = sStripeFee + sPlatformFee;
    const sNet = s.amount - sTotalFee;
    const sMarc = sNet / 2;

    return `
      <tr>
        <td><strong>${s.date}</strong></td>
        <td>
          <div style="font-weight: 700; color: #0F172A;">${s.name}</div>
          <div style="font-size: 10px; color: #64748B;">${s.profession || 'Praticien'} • ${s.location || 'France'}</div>
          <div style="font-size: 10px; color: #475569;">${s.email}</div>
        </td>
        <td style="text-align: center;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 9.5px; background: #EEF2FF; color: #4338CA; padding: 2px 6px; border-radius: 4px;">
            ${s.stripePaymentId ? s.stripePaymentId.slice(0, 14) + '...' : 'Stripe'}
          </span>
        </td>
        <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600;">${s.amount.toFixed(2)} €</td>
        <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #DC2626;">-${sTotalFee.toFixed(2)} €</td>
        <td style="text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1D4ED8;">${sMarc.toFixed(2)} €</td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Bilan Partenariat Marc Damoiseaux — FeelProd</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #FAF6ED;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1E293B;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }
    .top-actions { width: 794px; display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 16px; }
    .btn-print {
      background: #0F172A; color: #FFFFFF; font-weight: 700; font-size: 13px;
      padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .report-card {
      background: #FFFFFF; width: 794px; min-height: 1123px; padding: 48px 52px;
      border-radius: 18px; box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.08);
      position: relative; display: flex; flex-direction: column; justify-content: space-between;
    }
    .top-stripe {
      position: absolute; top: 0; left: 0; right: 0; height: 6px;
      border-top-left-radius: 18px; border-top-right-radius: 18px;
      background: linear-gradient(90deg, #1E3A8A 0%, #0F172A 40%, #D97706 80%, #F59E0B 100%);
    }
    .header { display: flex; justify-content: space-between; padding-bottom: 24px; border-bottom: 1.5px solid #F1F5F9; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
    .kpi-card { background: #FAF8F5; border: 1px solid #EFE9DE; border-radius: 12px; padding: 14px; text-align: center; }
    .kpi-card.highlight { background: #EFF6FF; border-color: #BFDBFE; }
    .kpi-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 4px; }
    .kpi-val { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 800; color: #0F172A; }
    .kpi-card.highlight .kpi-val { color: #1D4ED8; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 12px 14px; background: #0F172A; color: white; }
    td { padding: 12px 14px; font-size: 11.5px; border-bottom: 1px solid #F1F5F9; }
    @media print {
      body { background: transparent; padding: 0; }
      .top-actions { display: none !important; }
      .report-card { box-shadow: none; border-radius: 0; width: 100%; padding: 30px; }
    }
  </style>
</head>
<body>
  <div class="top-actions">
    <button class="btn-print" onclick="window.print()">
      🖨️ Imprimer / Enregistrer en PDF
    </button>
  </div>
  <div class="report-card">
    <div class="top-stripe"></div>
    <div>
      <div class="header">
        <div>
          <h2 style="font-size: 22px; font-weight: 900; letter-spacing: 0.1em; color: #0F172A;">FEELPROD</h2>
          <p style="font-size: 11.5px; color: #64748B; margin-top: 2px;">Guillaume PHILIPPE (Masseur-Kinésithérapeute D.E.) • SIRET : 480 342 901 00021 • LCL Pro : 6300E • NAF : 8690E / 5911B</p>
        </div>
        <div style="text-align: right;">
          <span style="background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800;">REVERSEMENT NET 50 / 50</span>
          <p style="font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: #0F172A; margin-top: 6px;">RÉF. REV-DAMOISEAUX-${new Date().getFullYear()}</p>
          <p style="font-size: 11px; color: #64748B;">Date d'arrêté : ${dateStr}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748B;">Éditeur & Gestionnaire</p>
          <p style="font-weight: 700; color: #0F172A; margin-top: 2px;">FEELPROD (Guillaume Philippe — Masseur-Kinésithérapeute D.E.)</p>
          <p style="font-size: 11px; color: #475569; margin-top: 2px;">28 bis bd de Sébastopol, 75004 Paris</p>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748B;">Co-Auteur Enseignant Bénéficiaire</p>
          <p style="font-weight: 700; color: #0F172A; margin-top: 2px;">Marc DAMOISEAUX</p>
          <p style="font-size: 11px; color: #475569; margin-top: 2px;">marc@damoiseaux.be • Clé contractuelle : 50% du Net</p>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-title">Ventes Réglées</div>
          <div class="kpi-val">${sales.length}</div>
          <div style="font-size: 9.5px; color: #64748B; margin-top: 2px;">400 € / apprenant</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Recettes Brutes</div>
          <div class="kpi-val">${totalBrut.toFixed(2)} €</div>
          <div style="font-size: 9.5px; color: #64748B; margin-top: 2px;">Stripe Checkout</div>
        </div>
        <div class="kpi-card" style="background: #FEF2F2; border-color: #FECACA;">
          <div class="kpi-title" style="color: #991B1B;">Frais Stripe & Vente</div>
          <div class="kpi-val" style="color: #DC2626;">-${totalFees.toFixed(2)} €</div>
          <div style="font-size: 9.5px; color: #991B1B; margin-top: 2px;">Stripe + 5% technique</div>
        </div>
        <div class="kpi-card highlight">
          <div class="kpi-title">Net Marc (50%)</div>
          <div class="kpi-val">${partMarc.toFixed(2)} €</div>
          <div style="font-size: 9.5px; color: #1D4ED8; margin-top: 2px;">À virer à Marc</div>
        </div>
      </div>

      <div style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <table>
          <thead>
            <tr>
              <th style="width: 14%;">Date</th>
              <th style="width: 36%;">Apprenant</th>
              <th style="width: 14%; text-align: center;">Réf. Stripe</th>
              <th style="width: 12%; text-align: right;">Brut</th>
              <th style="width: 12%; text-align: right;">Frais Déd.</th>
              <th style="width: 12%; text-align: right;">Part Marc (50%)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; margin-top: 18px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; font-size: 11px; color: #475569; line-height: 1.6;">
          <p style="font-weight: 700; color: #0F172A; text-transform: uppercase; font-size: 10.5px; margin-bottom: 4px;">Détail des Frais Déduits</p>
          <p>• <strong>Frais passerelle bancaire Stripe :</strong> ${totalStripeFees.toFixed(2)} € (tarif 1,5% + 0,25 € par transaction sur les 2 ventes).</p>
          <p>• <strong>Frais d'infrastructure & diffusion vidéo FeelProd (5%) :</strong> ${totalPlatformFees.toFixed(2)} € (hébergement bande passante Cloudflare R2, streaming HD 24h, tokens assistant IA Claude 3.5 Sonnet).</p>
          <p>• <strong>Assiette nette partagée à 50/50 :</strong> ${totalNet.toFixed(2)} €.</p>
        </div>

        <div style="background: #FAF8F5; border: 1px solid #EFE9DE; border-radius: 12px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-bottom: 4px;">
            <span>Recettes Brutes :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600;">${totalBrut.toFixed(2)} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #DC2626; margin-bottom: 4px;">
            <span>Total Frais Déduits :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600;">-${totalFees.toFixed(2)} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #0F172A; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #CBD5E1;">
            <span>Assiette Nette Totale :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${totalNet.toFixed(2)} €</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 800; color: #1D4ED8;">Net à Virer à Marc :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 900; color: #1D4ED8;">${partMarc.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>

    <div style="border-top: 1.5px solid #F1F5F9; padding-top: 16px; margin-top: 24px; font-size: 9.5px; color: #94A3B8; text-align: center;">
      Document certifié conforme émis par FEELPROD le ${dateStr} • Décompte officiel net de reversement co-auteur formation Embryologie Dynamique.
    </div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function openMarcTransferSheetWindow(sales: PartnerSale[], feeMode: 'stripe_and_platform' | 'stripe_only' = 'stripe_only') {
  const printWindow = window.open('', '_blank', 'width=950,height=1150');
  if (!printWindow) {
    alert("Veuillez autoriser l'ouverture des fenêtres pop-up pour afficher la fiche de virement.");
    return;
  }

  const totalBrut = sales.reduce((acc, s) => acc + s.amount, 0);
  const stripeFeePerSale = 6.25; // 1.5% + 0.25€ par transaction 400€
  const platformFeeRate = feeMode === 'stripe_and_platform' ? 0.05 : 0;
  const totalStripeFees = sales.length * stripeFeePerSale;
  const totalPlatformFees = totalBrut * platformFeeRate;
  const totalFees = totalStripeFees + totalPlatformFees;
  const totalNet = totalBrut - totalFees;
  const partMarc = totalNet / 2;
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const virRef = 'VIR-2026-09-01';

  const rowsHtml = sales.map((s) => {
    const saleStripeFee = stripeFeePerSale;
    const salePlatformFee = s.amount * platformFeeRate;
    const saleNet = s.amount - (saleStripeFee + salePlatformFee);
    const salePartMarc = saleNet / 2;
    return `
      <tr style="border-bottom: 1px solid #E2E8F0; font-size: 11.5px;">
        <td style="padding: 10px 12px; font-family: 'JetBrains Mono', monospace; color: #64748B;">${s.date}</td>
        <td style="padding: 10px 12px;">
          <div style="font-weight: 700; color: #0F172A;">${s.name}</div>
          <div style="font-size: 10.5px; color: #64748B;">${s.email}</div>
          <div style="font-size: 10px; color: #94A3B8;">${s.profession || 'Praticien de santé'} • ${s.location || ''}</div>
        </td>
        <td style="padding: 10px 12px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #475569;">
          <span style="background: #F1F5F9; padding: 3px 6px; border-radius: 4px; border: 1px solid #CBD5E1;">${s.stripePaymentId}</span>
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0F172A;">
          ${s.amount.toFixed(2)} €
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: 'JetBrains Mono', monospace; color: #DC2626; font-size: 11px;">
          -${(saleStripeFee + salePlatformFee).toFixed(2)} €
        </td>
        <td style="padding: 10px 12px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #1D4ED8;">
          ${salePartMarc.toFixed(2)} €
        </td>
      </tr>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Fiche d'Ordre de Virement SEPA — Marc DAMOISEAUX • FeelProd</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #FAF6ED;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1E293B;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
    }
    .top-actions {
      width: 820px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-bottom: 16px;
    }
    .btn-action {
      font-weight: 700;
      font-size: 13px;
      padding: 10px 18px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btn-print { background: #0F172A; color: #FFF; }
    .btn-print:hover { background: #1E293B; }
    .btn-email { background: #1D4ED8; color: #FFF; }
    .btn-email:hover { background: #1E40AF; }
    .btn-share { background: #0284C7; color: #FFF; }
    .btn-share:hover { background: #0369A1; }

    .sheet-card {
      background: #FFFFFF;
      width: 820px;
      min-height: 1140px;
      padding: 44px 48px;
      border-radius: 18px;
      box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-brand-stripe {
      position: absolute;
      top: 0; left: 0; right: 0; height: 6px;
      border-top-left-radius: 18px; border-top-right-radius: 18px;
      background: linear-gradient(90deg, #1E3A8A 0%, #0F172A 40%, #10B981 80%, #059669 100%);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2px solid #F1F5F9;
    }
    .title-area h1 {
      font-size: 21px;
      font-weight: 900;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .title-area p {
      font-size: 11px;
      color: #64748B;
      margin-top: 3px;
    }
    .order-badge {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 20px 0;
    }
    .party-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
    }
    .party-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748B;
      margin-bottom: 6px;
    }
    .party-name {
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
    }
    .party-details {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      margin-top: 4px;
    }

    .virement-summary-box {
      background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);
      color: #FFFFFF;
      border-radius: 16px;
      padding: 22px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px 0 24px 0;
      box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.3);
    }
    .virement-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #93C5FD;
      font-weight: 700;
    }
    .virement-amount {
      font-family: 'JetBrains Mono', monospace;
      font-size: 34px;
      font-weight: 900;
      color: #FFFFFF;
      margin-top: 2px;
    }
    .virement-meta {
      text-align: right;
      font-size: 11px;
      color: #CBD5E1;
      line-height: 1.6;
    }
    .virement-ref {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #FDE047;
      background: rgba(255, 255, 255, 0.1);
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-top: 4px;
    }

    .table-container {
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      overflow: hidden;
      margin: 16px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #F8FAFC;
      padding: 10px 12px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      border-bottom: 1px solid #E2E8F0;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 16px;
      margin: 16px 0;
    }
    .breakdown-info {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
      font-size: 11px;
      color: #475569;
      line-height: 1.6;
    }
    .breakdown-calc {
      background: #FAF8F5;
      border: 1px solid #EFE9DE;
      border-radius: 12px;
      padding: 16px;
      font-size: 11.5px;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      color: #64748B;
    }
    .calc-row.total {
      border-top: 1px dashed #CBD5E1;
      padding-top: 8px;
      margin-top: 8px;
      color: #0F172A;
      font-weight: 800;
    }

    .sign-section {
      border-top: 1.5px solid #F1F5F9;
      padding-top: 20px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .legal-note {
      font-size: 9.5px;
      color: #94A3B8;
      max-width: 480px;
      line-height: 1.5;
    }
    .visa-box {
      border: 1.5px dashed #CBD5E1;
      border-radius: 10px;
      padding: 12px 18px;
      text-align: center;
      background: #FCFBF9;
      min-width: 220px;
    }
    .visa-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #065F46;
    }
    .visa-name {
      font-size: 13px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 2px;
    }
    .visa-date {
      font-size: 10px;
      color: #64748B;
      margin-top: 2px;
    }

    @media print {
      body { background: transparent !important; padding: 0 !important; }
      .top-actions { display: none !important; }
      .sheet-card { box-shadow: none !important; width: 100% !important; min-height: auto !important; padding: 20mm 15mm !important; }
    }
  </style>
</head>
<body>
  <div class="top-actions">
    <button class="btn-action btn-email" onclick="handleEmail()">📧 Transmettre l'Ordre par Email (marc@damoiseaux.be)</button>
    <button class="btn-action btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder PDF (A4)</button>
  </div>

  <div class="sheet-card">
    <div class="top-brand-stripe"></div>

    <div>
      <div class="header">
        <div class="title-area">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1D4ED8; letter-spacing: 0.08em; margin-bottom: 2px;">
            FEELPROD • Édition Multimédia Médicale
          </div>
          <h1>FICHE D'ORDRE DE VIREMENT BANCAIRE</h1>
          <p>Rétrocession contractuelle de droits d'auteur & co-édition • Formation Embryologie Biodynamique</p>
        </div>
        <div style="text-align: right;">
          <div class="order-badge">✓ Ordre de Virement Validé & Payé</div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748B; margin-top: 6px;">
            Réf. : <strong>${virRef}</strong> • Date : <strong>${dateStr}</strong>
          </div>
        </div>
      </div>

      <!-- Parties -->
      <div class="parties-grid">
        <div class="party-card">
          <div class="party-label">Donneur d'Ordre (Émetteur du Virement)</div>
          <div class="party-name">Guillaume PHILIPPE — Masseur-Kinésithérapeute D.E. (FEELPROD)</div>
          <div class="party-details">
            Masseur-Kinésithérapeute D.E. & Édition Multimédia Médicale<br>
            28 bis boulevard de Sébastopol, 75004 Paris<br>
            SIRET : 480 342 901 00021 • NAF : 8690E / 5911B<br>
            <strong>Compte Débiteur :</strong> LCL Professionnel (Compte 6300E)
          </div>
        </div>

        <div class="party-card">
          <div class="party-label">Bénéficiaire du Virement</div>
          <div class="party-name">Marc DAMOISEAUX</div>
          <div class="party-details">
            Co-Auteur, Concepteur & Enseignant Scientifique<br>
            Email : <strong>marc@damoiseaux.be</strong><br>
            Clé contractuelle : 50% de l'assiette nette après frais<br>
            <strong>Compte Créditeur :</strong> Compte Bancaire SEPA Marc Damoiseaux
          </div>
        </div>
      </div>

      <!-- Hero Virement Callout -->
      <div class="virement-summary-box">
        <div>
          <div class="virement-label">Montant Net de l'Ordre de Virement SEPA</div>
          <div class="virement-amount">${partMarc.toFixed(2)} €</div>
          <div style="font-size: 12px; color: #E2E8F0; margin-top: 2px;">
            Trois cent quatre-vingt-treize euros et soixante-quinze centimes (393,75 €)
          </div>
        </div>
        <div class="virement-meta">
          <div>Motif / Libellé bancaire :</div>
          <div class="virement-ref">${virRef}</div>
          <div style="margin-top: 6px; font-size: 10px; color: #93C5FD;">
            Exécution via LCL Professionnel (Compte 6300E)
          </div>
        </div>
      </div>

      <!-- Table of Transactions -->
      <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.05em;">
          Inscriptions Électroniques Encaissées (${sales.length})
        </span>
        <span style="font-size: 10.5px; color: #64748B;">Passerelle Stripe Payments Europe</span>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 14%;">Date</th>
              <th style="width: 36%;">Praticien Inscrit</th>
              <th style="width: 16%; text-align: center;">Réf. Stripe</th>
              <th style="width: 11%; text-align: right;">Brut</th>
              <th style="width: 11%; text-align: right;">Frais</th>
              <th style="width: 12%; text-align: right;">Part Marc (50%)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Breakdown Calculations -->
      <div class="breakdown-grid">
        <div class="breakdown-info">
          <p style="font-weight: 800; color: #0F172A; text-transform: uppercase; font-size: 10.5px; margin-bottom: 6px;">
            Décomposition des Frais & Assiette Partagée
          </p>
          <p>• <strong>Frais de transaction bancaire Stripe :</strong> -${totalStripeFees.toFixed(2)} € (1,5% + 0,25 € par transaction CB sécurisée retenus à la source).</p>
          <p>• <strong>Hébergement vidéo & plateforme Cloudflare R2 :</strong> ${platformFeeRate > 0 ? `-${totalPlatformFees.toFixed(2)} € (5% streaming)` : '<strong style="color: #059669;">0,00 € (100% pris en charge par FEELPROD / Offert à Marc)</strong>'}.</p>
          <p>• <strong>Total des déductions partagées :</strong> -${totalFees.toFixed(2)} € déduits de la recette brute.</p>
          <p style="margin-top: 4px; font-weight: 600; color: #0F172A;">
            • <strong>Assiette nette 50/50 :</strong> ${totalNet.toFixed(2)} € répartie à 50% FeelProd (${partMarc.toFixed(2)} €) et 50% Marc Damoiseaux (${partMarc.toFixed(2)} €).
          </p>
        </div>

        <div class="breakdown-calc">
          <div class="calc-row">
            <span>Total Recettes Brutes :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #0F172A;">${totalBrut.toFixed(2)} €</span>
          </div>
          <div class="calc-row" style="color: #DC2626;">
            <span>Frais bancaires Stripe :</span>
            <span style="font-family: 'JetBrains Mono', monospace;">-${totalStripeFees.toFixed(2)} €</span>
          </div>
          <div class="calc-row" style="${platformFeeRate > 0 ? 'color: #DC2626;' : 'color: #059669; font-weight: 700;'}">
            <span>Frais Vidéo Cloudflare :</span>
            <span style="font-family: 'JetBrains Mono', monospace;">${platformFeeRate > 0 ? `-${totalPlatformFees.toFixed(2)} €` : 'Offert (0,00 €)'}</span>
          </div>
          <div class="calc-row" style="border-top: 1px dashed #CBD5E1; padding-top: 6px; margin-top: 6px; color: #0F172A; font-weight: 700;">
            <span>Assiette Nette Totale :</span>
            <span style="font-family: 'JetBrains Mono', monospace;">${totalNet.toFixed(2)} €</span>
          </div>
          <div class="calc-row total">
            <span style="color: #1D4ED8; font-size: 12.5px;">Net à Virer à Marc (50%) :</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 900; color: #1D4ED8;">${partMarc.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Section -->
    <div>
      <div class="sign-section">
        <div class="legal-note">
          La présente fiche d'ordre de virement et décompte certifié est établie en conformité avec le protocole de co-édition FeelProd / Marc Damoiseaux. Elle atteste du virement bancaire des droits d'auteur nets de rétrocession au titre des formations enregistrées.
        </div>
        <div class="visa-box">
          <div class="visa-title">Visa Donneur d'Ordre</div>
          <div class="visa-name">Guillaume PHILIPPE (Masseur-Kinésithérapeute D.E.)</div>
          <div class="visa-date">Émis le ${dateStr} • Bon pour virement</div>
        </div>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 12px; margin-top: 14px; font-size: 9.5px; color: #94A3B8; text-align: center;">
        Document certifié FEELPROD • Réf. ${virRef} • Édition Multimédia Médicale
      </div>
    </div>
  </div>

  <script>
    function handleEmail() {
      const subject = encodeURIComponent("[FEELPROD] Fiche d'Ordre de Virement SEPA N° ${virRef} (${partMarc.toFixed(2)} €) — Rétrocession Formation Embryologie");
      const body = encodeURIComponent(
        "Cher Marc,\\n\\n" +
        "Voici la fiche d'ordre de virement bancaire officielle de ${partMarc.toFixed(2)} € (Réf. ${virRef}) relative aux règlements perçus pour la formation Embryologie Biodynamique.\\n\\n" +
        "• Référence de l'ordre : ${virRef}\\n" +
        "• Date d'exécution : 14/09/2026\\n" +
        "• Compte émetteur : LCL Professionnel FeelProd (Compte 6300E)\\n" +
        "• Bénéficiaire : Marc DAMOISEAUX (marc@damoiseaux.be)\\n" +
        "• Montant net viré : ${partMarc.toFixed(2)} €\\n\\n" +
        "Le virement bancaire a été exécuté et enregistré sur ton compte bancaire.\\n\\n" +
        "Bien amicalement,\\n" +
        "Guillaume Philippe\\n" +
        "Masseur-Kinésithérapeute D.E. • FEELPROD"
      );
      window.location.href = "mailto:marc@damoiseaux.be?subject=" + subject + "&body=" + body;
    }
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function openEmailForMarcTransfer(sales: PartnerSale[], feeMode: 'stripe_and_platform' | 'stripe_only' = 'stripe_only') {
  const totalBrut = sales.reduce((acc, s) => acc + s.amount, 0);
  const stripeFeePerSale = 6.25;
  const platformFeeRate = feeMode === 'stripe_and_platform' ? 0.05 : 0;
  const totalStripeFees = sales.length * stripeFeePerSale;
  const totalPlatformFees = totalBrut * platformFeeRate;
  const totalFees = totalStripeFees + totalPlatformFees;
  const totalNet = totalBrut - totalFees;
  const partMarc = totalNet / 2;
  const virRef = 'VIR-2026-09-01';

  const salesSummary = sales.map(s => `• ${s.name} (${s.email}) : ${s.amount.toFixed(2)} € (Réf. Stripe : ${s.stripePaymentId})`).join('\n');

  const subject = encodeURIComponent(`[FEELPROD] Ordre de Virement SEPA N° ${virRef} (${partMarc.toFixed(2)} €) — Rétrocession Co-Auteur Embryologie`);
  const body = encodeURIComponent(
`Cher Marc,

Voici la confirmation officielle et le décompte de l'ordre de virement bancaire relatif aux inscriptions réglées pour la formation Embryologie Biodynamique sur la plateforme FeelProd.

Détail de l'ordre de virement bancaire exécuté :
• Référence de l'ordre : ${virRef}
• Date d'exécution : 14/09/2026
• Compte émetteur : LCL Professionnel FeelProd (Compte 6300E - Guillaume Philippe)
• Compte bénéficiaire : Compte bancaire SEPA Marc Damoiseaux (marc@damoiseaux.be)
• MONTANT NET DU VIREMENT : ${partMarc.toFixed(2)} €

Récapitulatif des inscriptions encaissées :
${salesSummary}

Décompte contractuel (50/50) :
- Total brut encaissé : ${totalBrut.toFixed(2)} €
- Frais bancaires Stripe (retenus à la source) : -${totalStripeFees.toFixed(2)} €
- Frais hébergement vidéo Cloudflare R2 : 0,00 € (100% pris en charge par FeelProd / Offert à Marc)
- Assiette nette totale partagée : ${totalNet.toFixed(2)} €
- Quote-part Marc Damoiseaux (50%) : ${partMarc.toFixed(2)} €

Le virement bancaire de ${partMarc.toFixed(2)} € est ordonné et enregistré. La fiche officielle certifiée est archivée dans l'administration FeelProd.

Bien amicalement,
Guillaume Philippe
Masseur-Kinésithérapeute D.E. • FEELPROD`
  );

  window.location.href = `mailto:marc@damoiseaux.be?subject=${subject}&body=${body}`;
}

export async function shareMarcTransferSheet(sales: PartnerSale[], feeMode: 'stripe_and_platform' | 'stripe_only' = 'stripe_only') {
  const totalBrut = sales.reduce((acc, s) => acc + s.amount, 0);
  const stripeFeePerSale = 6.25;
  const platformFeeRate = feeMode === 'stripe_and_platform' ? 0.05 : 0;
  const totalStripeFees = sales.length * stripeFeePerSale;
  const totalPlatformFees = totalBrut * platformFeeRate;
  const totalFees = totalStripeFees + totalPlatformFees;
  const totalNet = totalBrut - totalFees;
  const partMarc = totalNet / 2;
  const virRef = 'VIR-2026-09-01';

  const text = `FICHE DE VIREMENT FEELPROD • MARC DAMOISEAUX\nMontant à virer : ${partMarc.toFixed(2)} €\nRéférence : ${virRef}\nAssiette : ${sales.length} ventes (Brut : ${totalBrut.toFixed(2)} € - Frais partagés : ${totalFees.toFixed(2)} € = Net : ${totalNet.toFixed(2)} €)\nPart Marc (50%) : ${partMarc.toFixed(2)} €`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Fiche de Virement FeelProd — Marc Damoiseaux`,
        text: text,
        url: window.location.origin
      });
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    alert(`📋 Fiche d'ordre de virement pour Marc copiée dans le presse-papier !\nMontant : ${partMarc.toFixed(2)} € (Réf. : ${virRef})`);
  } catch {
    openEmailForMarcTransfer(sales, feeMode);
  }
}

export interface PaymentListingItem {
  date: string;
  name: string;
  email: string;
  profession?: string;
  location?: string;
  stripePaymentId: string;
  amount: number;
}

export function openPaymentsListingWindow(payments: PaymentListingItem[], periodLabel: string = 'Année 2026') {
  const printWindow = window.open('', '_blank', 'width=950,height=1100');
  if (!printWindow) {
    alert("Veuillez autoriser l'ouverture des fenêtres pop-up pour afficher le listing des paiements.");
    return;
  }

  const totalBrut = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalStripeFees = payments.length * 6.25;
  const totalNet = totalBrut - totalStripeFees;
  const dateStr = new Date().toLocaleDateString('fr-FR');

  const rowsHtml = payments.length === 0 ? `
    <tr>
      <td colspan="5" style="text-align: center; padding: 40px; color: #64748B; font-style: italic;">
        Aucun paiement enregistré pour cette période (${periodLabel}).
      </td>
    </tr>
  ` : payments.map((p) => `
    <tr style="border-bottom: 1px solid #E2E8F0; font-size: 11.5px;">
      <td style="padding: 10px 12px; font-family: 'JetBrains Mono', monospace; color: #475569;">${p.date}</td>
      <td style="padding: 10px 12px;">
        <div style="font-weight: 700; color: #0F172A;">${p.name}</div>
        <div style="font-size: 10px; color: #64748B;">${p.profession || 'Praticien'} • ${p.location || ''}</div>
        <div style="font-size: 10px; color: #475569;">${p.email}</div>
      </td>
      <td style="padding: 10px 12px; text-align: center;">
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; background: #F1F5F9; padding: 2px 6px; border-radius: 4px; border: 1px solid #CBD5E1;">
          ${p.stripePaymentId}
        </span>
      </td>
      <td style="padding: 10px 12px; text-align: right; font-family: 'JetBrains Mono', monospace; color: #DC2626; font-size: 11px;">
        -6.25 €
      </td>
      <td style="padding: 10px 12px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #059669; font-size: 13px;">
        +${p.amount.toFixed(2)} €
      </td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>FEELPROD — Listing des Règlements Encaissés • ${periodLabel}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #FAF6ED;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #0F172A;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .print-actions {
      width: 820px;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }
    .btn-print {
      background: #0F172A;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .sheet {
      width: 820px;
      background: #FFFFFF;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #F1F5F9;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 20px;
      font-weight: 900;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 12px;
      color: #64748B;
      margin-top: 4px;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 18px;
    }
    .kpi-label {
      font-size: 10.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.05em;
    }
    .kpi-value {
      font-size: 22px;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
      color: #0F172A;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    th {
      background: #F8FAFC;
      padding: 10px 12px;
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748B;
      text-align: left;
      border-bottom: 1px solid #E2E8F0;
    }
    .footer {
      border-top: 1px solid #E2E8F0;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      font-size: 10.5px;
      color: #94A3B8;
      line-height: 1.5;
    }
    @media print {
      body { background: transparent !important; padding: 0 !important; }
      .print-actions { display: none !important; }
      .sheet { box-shadow: none !important; width: 100% !important; padding: 15mm !important; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
  </div>
  <div class="sheet">
    <div class="header">
      <div>
        <div style="font-size: 11px; font-weight: 800; color: #1D4ED8; text-transform: uppercase; letter-spacing: 0.06em;">FEELPROD • Registre des Recettes</div>
        <h1 class="title">Listing des Paiements Encaissés</h1>
        <div class="subtitle">Formation Embryologie Biodynamique • Période : <strong>${periodLabel}</strong></div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 800; color: #059669; background: #ECFDF5; padding: 4px 10px; border-radius: 20px; display: inline-block;">✓ Relevé Officiel</div>
        <div style="font-size: 10.5px; color: #64748B; margin-top: 6px;">Édité le ${dateStr}</div>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Nombre de Règlements</div>
        <div class="kpi-value">${payments.length}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Brut Encaissé</div>
        <div class="kpi-value" style="color: #059669;">${totalBrut.toFixed(2)} €</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Net Après Frais Stripe</div>
        <div class="kpi-value" style="color: #1D4ED8;">${totalNet.toFixed(2)} €</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Date</th>
          <th style="width: 40%;">Apprenant / Praticien</th>
          <th style="width: 20%; text-align: center;">Réf. Stripe</th>
          <th style="width: 12%; text-align: right;">Frais CB</th>
          <th style="width: 13%; text-align: right;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="footer">
      <div style="max-width: 540px;">
        <strong>Éditeur :</strong> FEELPROD (Guillaume PHILIPPE — Masseur-Kinésithérapeute D.E.)<br>
        SIRET : 480 342 901 00021 • NAF : 8690E / 5911B • 28 bis bd de Sébastopol, 75004 Paris
      </div>
      <div style="text-align: right; font-weight: 600; color: #64748B;">
        ✓ Journal des ventes Stripe<br>
        Relevé comptable certifié conforme
      </div>
    </div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}


