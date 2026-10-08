#!/usr/bin/env python3
"""
FeelProd Master Email Generator & Dispatcher (Production Standard V13)
Generates standalone HTML emails and dispatches them via SMTP SSL.

Usage:
  python3 generate_update_email.py --preview              # Generate HTML & open on Desktop
  python3 generate_update_email.py --send                 # Dispatch to Gmail & iCloud
  python3 generate_update_email.py --send --recipient x@y # Dispatch to specific recipient
"""
import os
import sys
import argparse
import base64
import smtplib
import ssl
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.utils import formatdate

TEMPLATE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_FILE = os.path.join(TEMPLATE_DIR, "TEMPLATE_MASTER_FEELPROD.html")
ASSETS_DIR = os.path.join(TEMPLATE_DIR, "assets")

EMAIL_FROM = "guillaumephilippe1968@gmail.com"
DEFAULT_RECIPIENTS = ["guillaumephilippe1968@gmail.com", "guillaumephilippe@me.com"]
EMAIL_PASSWORD = "fpmcgoszzwxqlcwl"

DESKTOP_DIR = "/Users/guillaumephilippe/Desktop"
DESKTOP_BANNER = os.path.join(DESKTOP_DIR, "Apercu_Mise_a_Jour_Embryo_Premium.png")
OUTPUT_HTML = os.path.join(DESKTOP_DIR, "Email_Mise_a_Jour_Embryo_Premium.html")
OUTPUT_EML = os.path.join(DESKTOP_DIR, "Email_Mise_a_Jour_Embryo_Premium.eml")

# Default Cartouches Data (4 Feuillets / 4 Thèmes FeelProd)
DEFAULT_CARTOUCHES = [
    {
        "id": "pdf",
        "bg": "#FAFBFD",
        "border": "#D6E3EF",
        "shadow": "rgba(65, 113, 181, 0.04)",
        "icon_file": "exact_btn_1_pdf.png",
        "icon_w": 86,
        "icon_h": 27,
        "badge_text": "NOUVEAU",
        "badge_color": "#2B5C9E",
        "badge_bg": "#E4EFF9",
        "badge_border": "#C8DFF2",
        "title": "Lecture & Export PDF (Fiche A4 & Recueil)",
        "desc": "Consultez vos livrets haute définition directement dans le lecteur. Exportez en 1 clic la <strong>Fiche Chapitre A4</strong> ou téléchargez le <strong>Recueil Intégral</strong> complet pour votre étude papier."
    },
    {
        "id": "history",
        "bg": "#FDFAF8",
        "border": "#F6DDD0",
        "shadow": "rgba(242, 125, 51, 0.04)",
        "icon_file": "icon_cartouche_2_history.png",
        "icon_w": 34,
        "icon_h": 34,
        "icon_radius": "10px",
        "badge_text": "HISTORIQUE",
        "badge_color": "#D96216",
        "badge_bg": "#FDEEE4",
        "badge_border": "#FCD9C3",
        "title": "Historique & Moteur de Recherche IA",
        "desc": "Vos questions et réponses passées sont automatiquement conservées dans le nouveau tiroir d'historique. Retrouvez instantanément vos échanges et notes cliniques d'un simple mot-clé."
    },
    {
        "id": "video",
        "bg": "#FAFBF9",
        "border": "#D6EAD5",
        "shadow": "rgba(90, 156, 81, 0.04)",
        "icon_file": "exact_btn_3_video_duo.png",
        "icon_w": 70,
        "icon_h": 32,
        "badge_text": "CLARTÉ",
        "badge_color": "#2E7D32",
        "badge_bg": "#EEF7F1",
        "badge_border": "#C8E6D3",
        "title": "Nouvelle Disposition des Deux Icônes Vidéo",
        "desc": "Sous le lecteur, les deux boutons ont été séparés et clarifiés pour une prise en main évidente et sans confusion : l'icône bleu ardoise détache la vidéo en mode flottant (pour prendre vos notes en plein écran), et l'icône terracotta permet d'enregistrer vos cours hors-ligne."
    },
    {
        "id": "podcasts",
        "bg": "#FDFBF7",
        "border": "#F5E8C4",
        "shadow": "rgba(242, 183, 41, 0.04)",
        "icon_file": "icon_cartouche_4_podcasts.png",
        "icon_w": 34,
        "icon_h": 34,
        "icon_radius": "10px",
        "badge_text": "6 LANGUES",
        "badge_color": "#B37D0B",
        "badge_bg": "#FEF7DE",
        "badge_border": "#FBE6A3",
        "title": "Podcasts Internationaux Dédiés",
        "desc": "L'intégralité des cours audio est accessible en 6 langues (Français, Anglais, Espagnol, Italien, Allemand, Japonais, Chinois) avec voix naturelles clonées pour une écoute nomade."
    }
]

def render_cartouches_html(cartouches, icon_resolver):
    html_cards = []
    for c in cartouches:
        icon_src = icon_resolver(c["icon_file"])
        radius_style = f" border-radius: {c.get('icon_radius')};" if "icon_radius" in c else ""
        card = f"""
              <div class="mobile-feature-pill" style="background-color: {c['bg']}; border-radius: 26px; -webkit-border-radius: 26px; border: 1.5px solid {c['border']}; padding: 18px 22px; margin-bottom: 16px; box-shadow: 0 4px 14px {c['shadow']}; box-sizing: border-box;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px; border-collapse: separate !important; border-spacing: 0;">
                  <tr>
                    <td valign="middle" align="left">
                      <img src="{icon_src}" alt="{c['title']}" width="{c['icon_w']}" height="{c['icon_h']}" style="display: block; border: 0; width: {c['icon_w']}px; height: {c['icon_h']}px;{radius_style}" />
                    </td>
                    <td valign="middle" align="right">
                      <span style="font-size: 10.5px; font-weight: 700; color: {c['badge_color']}; background: {c['badge_bg']}; border: 1px solid {c['badge_border']}; padding: 3px 10px; border-radius: 9999px; -webkit-border-radius: 9999px; text-transform: uppercase;">{c['badge_text']}</span>
                    </td>
                  </tr>
                </table>
                <h3 class="mobile-feature-title" style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: #0F172A; line-height: 1.35; letter-spacing: -0.2px;">
                  {c['title']}
                </h3>
                <p class="mobile-feature-desc" style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                  {c['desc']}
                </p>
              </div>
        """
        html_cards.append(card.strip())
    return "\n\n".join(html_cards)

def render_wuwai_bandeau(wuwai_src):
    return f"""
          <!-- Bandeau WUWAI (Prop 3 : Ruban Sobre Épuré) -->
          <tr>
            <td style="padding: 18px 24px 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; border: 1px solid #ECE7DD; border-radius: 14px; -webkit-border-radius: 14px; padding: 7px 16px;">
                <tr>
                  <td align="center" valign="middle">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; border-collapse: separate; border-spacing: 0;">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <img src="{wuwai_src}" width="30" height="30" alt="Wuwai" style="display: block; border-radius: 50%; border: 1px solid #E5DFD4; background-color: #FDFBF7;" />
                        </td>
                        <td valign="middle" style="text-align: left; white-space: nowrap;">
                          <span style="font-size: 13.5px; font-weight: 800; color: #0F172A; letter-spacing: 0.4px;">WUWAI</span>
                          <span style="font-size: 13px; font-weight: 600; color: #2E5A88; margin-left: 6px;">&laquo;&nbsp;Le non-agir&nbsp;&raquo;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    """.strip()

RECIPIENTS_OFFICIAL = [
    {"name": "Marc Damoiseaux", "email": "marc@damoiseaux.be", "greeting": "Bonjour Marc,"},
    {"name": "Gilles Ducret", "email": "gilles.ducret216@orange.fr", "greeting": "Bonjour Gilles,"},
    {"name": "Karl Massou", "email": "karlosteo@gmail.com", "greeting": "Bonjour Karl,"},
    {"name": "Guillaume Philippe", "email": "guillaumephilippe1968@gmail.com", "greeting": "Bonjour Guillaume,"},
    {"name": "Guillaume Philippe", "email": "guillaumephilippe@me.com", "greeting": "Bonjour Guillaume,"},
]

def get_greeting_for_email(email_addr):
    for r in RECIPIENTS_OFFICIAL:
        if r["email"].lower() == email_addr.lower():
            return r["greeting"]
    return "Bonjour,"

def resolve_banner_path():
    candidates = [
        DESKTOP_BANNER,
        os.path.join(ASSETS_DIR, "banner_embryo.png"),
        "/Users/guillaumephilippe/.gemini/antigravity/brain/1deb156e-63c1-4a48-bda3-c91799ff7fbe/Apercu_Mise_a_Jour_Embryo_Premium.png"
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    raise FileNotFoundError("Banner image not found in candidates")

def build_html(mode="base64", greeting="Bonjour Guillaume,"):
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        template = f.read()

    banner_path = resolve_banner_path()

    # Resolve banner & WUWAI
    if mode == "base64":
        with open(banner_path, "rb") as f:
            b_data = base64.b64encode(f.read()).decode("utf-8")
        banner_src = f"data:image/png;base64,{b_data}"

        wuwai_path = os.path.join(ASSETS_DIR, "logo_wuwai.png")
        with open(wuwai_path, "rb") as f:
            w_data = base64.b64encode(f.read()).decode("utf-8")
        wuwai_src = f"data:image/png;base64,{w_data}"
        
        def icon_resolver(fname):
            p = os.path.join(ASSETS_DIR, fname)
            with open(p, "rb") as f:
                d = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{d}"
    else:
        banner_src = "cid:banner_img"
        wuwai_src = "cid:logo_wuwai_png"
        def icon_resolver(fname):
            cid_name = fname.replace(".", "_")
            return f"cid:{cid_name}"

    cartouches_html = render_cartouches_html(DEFAULT_CARTOUCHES, icon_resolver)
    wuwai_bandeau_html = render_wuwai_bandeau(wuwai_src)

    tip_content = """
      <p style="margin: 0 0 6px 0; font-size: 13.5px; line-height: 1.5; color: #475569;">
        • <strong>Sur smartphone & tablette (iPhone, iPad, Android) :</strong> fermez complètement l'application (en la glissant vers le haut dans le sélecteur d'applis), puis rouvrez-la.
      </p>
      <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #475569;">
        • <strong>Sur ordinateur (Mac, PC) :</strong> actualisez simplement la page dans votre navigateur.
      </p>
    """

    replacements = {
        "{{SUBJECT}}": "✨ Du nouveau sur votre espace Embryologie Biodynamique",
        "{{WUWAI_BANDEAU_HTML}}": wuwai_bandeau_html,
        "{{BADGE_1}}": "✦ NOUVEAUTÉS",
        "{{BADGE_2}}": "ESPACE PREMIUM",
        "{{PRETITLE}}": "FORMATION EMBRYOLOGIE BIODYNAMIQUE",
        "{{TITLE_MAIN}}": "Une expérience clinique",
        "{{TITLE_ITALIC}}": "encore plus fluide",
        "{{SUBTITLE}}": "par Marc Damoiseaux, Ostéopathe D.O.",
        "{{BANNER_IMG_SRC}}": banner_src,
        "{{GREETING}}": greeting,
        "{{INTRO_PARAGRAPH}}": "Votre espace de formation s'enrichit ! De nouvelles fonctionnalités viennent d’être déployées pour rendre votre étude clinique encore plus accessible, intuitive et confortable au quotidien — même si vous n'avez pas encore eu le temps d'explorer l'application :",
        "{{CARTOUCHES_HTML}}": cartouches_html,
        "{{TIP_TITLE}}": "Comment actualiser votre application ?",
        "{{TIP_CONTENT}}": tip_content.strip(),
        "{{CTA_TEXT}}": "Accéder à mon Espace de Formation",
        "{{CTA_URL}}": "https://app.feelprod.com",
    }

    for k, v in replacements.items():
        template = template.replace(k, v)

    return template

def main():
    parser = argparse.ArgumentParser(description="FeelProd Email Update Generator")
    parser.add_argument("--preview", action="store_true", help="Generate standalone base64 HTML on Desktop")
    parser.add_argument("--send", action="store_true", help="Dispatch email via SMTP SSL")
    parser.add_argument("--batch", action="store_true", help="Dispatch to official list (Marc Damoiseaux, 2 buyers Ducret/Massou, and Guillaume)")
    parser.add_argument("--recipient", type=str, help="Specific recipient email")
    args = parser.parse_args()

    # Always write base64 HTML to desktop and local directory
    html_standalone = build_html(mode="base64", greeting="Bonjour Guillaume,")
    try:
        with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
            f.write(html_standalone)
        print(f"✅ Standalone HTML written to: {OUTPUT_HTML}")
    except Exception as e:
        print(f"⚠️ Notice: could not write to Desktop ({e})")

    local_html = os.path.join(TEMPLATE_DIR, "Email_Mise_a_Jour_Embryo_Premium.html")
    with open(local_html, "w", encoding="utf-8") as f:
        f.write(html_standalone)
    print(f"✅ Standalone HTML written to: {local_html}")

    # Also sync to EMAIL_MISE_A_JOUR_EMBRYO_PRET folder
    pret_dir = os.path.join(DESKTOP_DIR, "EMAIL_MISE_A_JOUR_EMBRYO_PRET")
    if os.path.exists(pret_dir):
        with open(os.path.join(pret_dir, "Email_Mise_a_Jour_Embryo_Premium.html"), "w", encoding="utf-8") as f:
            f.write(html_standalone)

    if args.send or args.batch:
        if args.batch:
            target_list = RECIPIENTS_OFFICIAL
        elif args.recipient:
            target_list = [{"name": args.recipient, "email": args.recipient, "greeting": get_greeting_for_email(args.recipient)}]
        else:
            target_list = [{"name": r, "email": r, "greeting": get_greeting_for_email(r)} for r in DEFAULT_RECIPIENTS]

        banner_path = resolve_banner_path()
        with open(banner_path, "rb") as f:
            banner_data = f.read()

        try:
            import certifi
            context = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            context = ssl._create_unverified_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            for item in target_list:
                rcpt = item["email"]
                greeting = item.get("greeting", "Bonjour,")
                html_cid = build_html(mode="cid", greeting=greeting)

                msg = MIMEMultipart("related")
                msg["Subject"] = "✨ Du nouveau sur votre espace Embryologie Biodynamique"
                msg["From"] = f"Guillaume Philippe <{EMAIL_FROM}>"
                msg["To"] = rcpt
                msg["Date"] = formatdate(localtime=True)
                msg_id = f"<feelprod-master-{int(time.time())}-{os.urandom(3).hex()}@feelprod.com>"
                msg["Message-ID"] = msg_id

                msg_alt = MIMEMultipart("alternative")
                msg.attach(msg_alt)
                msg_alt.attach(MIMEText("Veuillez consulter ce message au format HTML.", "plain", "utf-8"))
                msg_alt.attach(MIMEText(html_cid, "html", "utf-8"))

                # Banner
                img_part = MIMEImage(banner_data)
                img_part.add_header("Content-ID", "<banner_img>")
                img_part.add_header("Content-Disposition", "inline", filename="Apercu_Mise_a_Jour_Embryo_Premium.png")
                msg.attach(img_part)

                # WUWAI Logo
                with open(os.path.join(ASSETS_DIR, "logo_wuwai.png"), "rb") as f:
                    wdata = f.read()
                wpart = MIMEImage(wdata)
                wpart.add_header("Content-ID", "<logo_wuwai_png>")
                wpart.add_header("Content-Disposition", "inline", filename="logo_wuwai.png")
                msg.attach(wpart)

                # Icons
                for c in DEFAULT_CARTOUCHES:
                    fname = c["icon_file"]
                    cid_name = fname.replace(".", "_")
                    with open(os.path.join(ASSETS_DIR, fname), "rb") as f:
                        idata = f.read()
                    ipart = MIMEImage(idata)
                    ipart.add_header("Content-ID", f"<{cid_name}>")
                    ipart.add_header("Content-Disposition", "inline", filename=fname)
                    msg.attach(ipart)

                # Save last EML
                with open(OUTPUT_EML, "wb") as f:
                    f.write(msg.as_bytes())

                if os.path.exists(pret_dir):
                    with open(os.path.join(pret_dir, "Email_Mise_a_Jour_Embryo_Premium.eml"), "wb") as f:
                        f.write(msg.as_bytes())

                server.sendmail(EMAIL_FROM, [rcpt], msg.as_bytes())
                print(f"🚀 Sent to {item.get('name', rcpt)} <{rcpt}> ({greeting}) [ID: {msg_id}]")
                time.sleep(1)

        print("🎉 Batch delivery successful!")

if __name__ == "__main__":
    main()
