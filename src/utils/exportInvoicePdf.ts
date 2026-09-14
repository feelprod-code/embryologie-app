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
    <button class="btn-print" onclick="window.print()">🖨️ Imprimer ou Enregistrer en PDF (A4)</button>
  </div>

  <div class="invoice-card" id="invoice">
    <div class="top-brand-stripe"></div>

    <div>
      <div class="header">
        <div>
          <div class="brand-title">FEELPROD <span class="dot"></span></div>
          <div class="brand-subtitle">Guillaume PHILIPPE — Profession Libérale • Enseigne : FEELPROD</div>
          <div class="brand-legal">
            Production Audiovisuelle, Édition & Formations Numériques<br>
            28 bis boulevard de Sébastopol, 75004 Paris<br>
            <strong>SIRET :</strong> 480 342 901 00021 • <strong>Code NAF :</strong> 5911B / 8690E<br>
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
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
