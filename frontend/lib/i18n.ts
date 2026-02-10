export type Language = "en" | "id" | "de";

export type TranslationKey =
  | "nav_sign_in"
  | "nav_get_started"
  | "lang_label"
  | "theme_light"
  | "theme_dark"
  | "hero_badge"
  | "hero_title"
  | "hero_subtitle"
  | "cta_primary"
  | "cta_secondary"
  | "feature_daily_title"
  | "feature_daily_desc"
  | "feature_private_title"
  | "feature_private_desc"
  | "feature_mood_title"
  | "feature_mood_desc"
  | "auth_left_title"
  | "auth_left_subtitle"
  | "auth_footer_line"
  | "auth_register_title"
  | "auth_register_subtitle"
  | "auth_login_title"
  | "auth_login_subtitle"
  | "auth_name_label"
  | "auth_name_placeholder"
  | "auth_email_label"
  | "auth_password_label"
  | "auth_button_register"
  | "auth_button_login"
  | "auth_already"
  | "auth_new"
  | "auth_log_in"
  | "auth_create_account"
  | "shell_all_entries"
  | "shell_new_entry"
  | "shell_menu"
  | "shell_close"
  | "shell_today_focus"
  | "shell_capture"
  | "shell_sign_out"
  | "header_ready"
  | "insight_prompt_title"
  | "insight_prompt_loading"
  | "insight_prompt_empty"
  | "insight_mood_title"
  | "insight_mood_loading"
  | "insight_entries"
  | "insight_dominant"
  | "insight_top_count"
  | "insight_trend"
  | "insight_memory_title"
  | "insight_memory_loading"
  | "insight_memory_empty"
  | "entry_loading"
  | "entry_start_here"
  | "entry_first_title"
  | "entry_first_desc"
  | "entry_first_cta"
  | "entry_no_content"
  | "entry_updated";

const en: Record<TranslationKey, string> = {
  nav_sign_in: "Sign in",
  nav_get_started: "Get Started",
  lang_label: "Language",
  theme_light: "Light",
  theme_dark: "Dark",
  hero_badge: "A quiet thank you",
  hero_title: "For the moment you cared.",
  hero_subtitle: "A personal space created as a quiet thank you - for being there when it mattered.",
  cta_primary: "Write what matters",
  cta_secondary: "Sign in",
  feature_daily_title: "Daily Check-In",
  feature_daily_desc: "A place to pause and acknowledge today.",
  feature_private_title: "Private Journal",
  feature_private_desc: "Your thoughts stay here. Always.",
  feature_mood_title: "Mood Tracking",
  feature_mood_desc: "Understand how each day really felt.",
  auth_left_title: "Especially for you.",
  auth_left_subtitle: "This space exists because someone showed care at the right moment.",
  auth_footer_line: "Built especially for you - thank you for caring when I needed it.",
  auth_register_title: "Especially for you.",
  auth_register_subtitle: "This space exists because someone showed care at the right moment.",
  auth_login_title: "Welcome Back",
  auth_login_subtitle: "Continue writing your story.",
  auth_name_label: "Name",
  auth_name_placeholder: "What should we call you here?",
  auth_email_label: "Email",
  auth_password_label: "Password",
  auth_button_register: "Create your space",
  auth_button_login: "Sign In",
  auth_already: "Already have an account?",
  auth_new: "New to HanaDiary?",
  auth_log_in: "Log in",
  auth_create_account: "Create account",
  shell_all_entries: "All Entries",
  shell_new_entry: "New Entry",
  shell_menu: "Menu",
  shell_close: "Close",
  shell_today_focus: "Today's Focus",
  shell_capture: "Capture a moment of joy.",
  shell_sign_out: "Sign out",
  header_ready: "Ready to capture a moment of joy today?",
  insight_prompt_title: "Daily Prompt",
  insight_prompt_loading: "Loading prompt...",
  insight_prompt_empty: "No prompt available.",
  insight_mood_title: "Last 30 Days",
  insight_mood_loading: "Calculating trends...",
  insight_entries: "Entries",
  insight_dominant: "Dominant mood",
  insight_top_count: "Top mood count",
  insight_trend: "Trend",
  insight_memory_title: "On This Day",
  insight_memory_loading: "Loading memories...",
  insight_memory_empty: "No memory from this date yet.",
  entry_loading: "Loading entries...",
  entry_start_here: "Start here",
  entry_first_title: "Write your first note",
  entry_first_desc: "Start with one sentence about today. You can always come back later.",
  entry_first_cta: "Create First Entry",
  entry_no_content: "No content",
  entry_updated: "Updated",
};

const id: Record<TranslationKey, string> = {
  nav_sign_in: "Masuk",
  nav_get_started: "Mulai yuk",
  lang_label: "Bahasa",
  theme_light: "Terang",
  theme_dark: "Gelap",
  hero_badge: "Ucapan makasih kecil",
  hero_title: "Buat momen saat kamu peduli.",
  hero_subtitle: "Ruang personal yang dibuat sebagai ucapan terima kasih - karena kamu ada di waktu yang penting.",
  cta_primary: "Tulis yang paling penting",
  cta_secondary: "Masuk",
  feature_daily_title: "Check-In Harian",
  feature_daily_desc: "Tempat buat jeda bentar dan ngecek kabar hari ini.",
  feature_private_title: "Jurnal Pribadi",
  feature_private_desc: "Isi pikiranmu tetap di sini. Selalu.",
  feature_mood_title: "Lacak Mood",
  feature_mood_desc: "Biar kamu paham tiap hari rasanya gimana.",
  auth_left_title: "Spesial buat kamu.",
  auth_left_subtitle: "Ruang ini ada karena ada orang yang peduli di waktu yang pas.",
  auth_footer_line: "Dibikin khusus buat kamu - makasih udah peduli pas aku lagi butuh.",
  auth_register_title: "Spesial buat kamu.",
  auth_register_subtitle: "Ruang ini ada karena ada orang yang peduli di waktu yang pas.",
  auth_login_title: "Balik lagi, yuk",
  auth_login_subtitle: "Lanjutin cerita kamu di sini.",
  auth_name_label: "Nama",
  auth_name_placeholder: "Mau dipanggil apa di sini?",
  auth_email_label: "Email",
  auth_password_label: "Password",
  auth_button_register: "Bikin ruangmu",
  auth_button_login: "Masuk",
  auth_already: "Udah punya akun?",
  auth_new: "Baru di HanaDiary?",
  auth_log_in: "Masuk",
  auth_create_account: "Buat akun",
  shell_all_entries: "Semua Catatan",
  shell_new_entry: "Catatan Baru",
  shell_menu: "Menu",
  shell_close: "Tutup",
  shell_today_focus: "Fokus Hari Ini",
  shell_capture: "Coba tangkap satu momen bagus hari ini.",
  shell_sign_out: "Keluar",
  header_ready: "Siap nulis momen hari ini?",
  insight_prompt_title: "Prompt Harian",
  insight_prompt_loading: "Lagi ambil prompt...",
  insight_prompt_empty: "Belum ada prompt.",
  insight_mood_title: "30 Hari Terakhir",
  insight_mood_loading: "Lagi hitung tren...",
  insight_entries: "Jumlah catatan",
  insight_dominant: "Mood dominan",
  insight_top_count: "Mood terbanyak",
  insight_trend: "Tren",
  insight_memory_title: "Memori Hari Ini",
  insight_memory_loading: "Lagi ambil memori...",
  insight_memory_empty: "Belum ada memori di tanggal ini.",
  entry_loading: "Lagi load catatan...",
  entry_start_here: "Mulai dari sini",
  entry_first_title: "Tulis catatan pertamamu",
  entry_first_desc: "Mulai dari satu kalimat aja dulu, nanti bisa kamu lanjutin kapan pun.",
  entry_first_cta: "Buat Catatan Pertama",
  entry_no_content: "Belum ada isi",
  entry_updated: "Diupdate",
};

const de: Record<TranslationKey, string> = {
  nav_sign_in: "Anmelden",
  nav_get_started: "Loslegen",
  lang_label: "Sprache",
  theme_light: "Hell",
  theme_dark: "Dunkel",
  hero_badge: "Ein leises Danke",
  hero_title: "Für den Moment, in dem du dich gekümmert hast.",
  hero_subtitle: "Ein persönlicher Raum als stilles Dankeschön - dafür, dass du da warst, als es wichtig war.",
  cta_primary: "Schreib, was zählt",
  cta_secondary: "Anmelden",
  feature_daily_title: "Täglicher Check-in",
  feature_daily_desc: "Ein Ort, um kurz innezuhalten und den Tag wahrzunehmen.",
  feature_private_title: "Privates Journal",
  feature_private_desc: "Deine Gedanken bleiben hier. Immer.",
  feature_mood_title: "Stimmungsverlauf",
  feature_mood_desc: "Verstehe, wie sich jeder Tag wirklich angefühlt hat.",
  auth_left_title: "Ganz besonders für dich.",
  auth_left_subtitle: "Dieser Raum existiert, weil jemand im richtigen Moment Fürsorge gezeigt hat.",
  auth_footer_line: "Speziell für dich gemacht - danke, dass du da warst, als ich dich brauchte.",
  auth_register_title: "Ganz besonders für dich.",
  auth_register_subtitle: "Dieser Raum existiert, weil jemand im richtigen Moment Fürsorge gezeigt hat.",
  auth_login_title: "Willkommen zurück",
  auth_login_subtitle: "Schreib deine Geschichte weiter.",
  auth_name_label: "Name",
  auth_name_placeholder: "Wie sollen wir dich hier nennen?",
  auth_email_label: "E-Mail",
  auth_password_label: "Passwort",
  auth_button_register: "Erstelle deinen Raum",
  auth_button_login: "Anmelden",
  auth_already: "Du hast schon ein Konto?",
  auth_new: "Neu bei HanaDiary?",
  auth_log_in: "Anmelden",
  auth_create_account: "Konto erstellen",
  shell_all_entries: "Alle Einträge",
  shell_new_entry: "Neuer Eintrag",
  shell_menu: "Menü",
  shell_close: "Schließen",
  shell_today_focus: "Fokus heute",
  shell_capture: "Halte heute einen schönen Moment fest.",
  shell_sign_out: "Abmelden",
  header_ready: "Bereit, heute einen Moment festzuhalten?",
  insight_prompt_title: "Tagesimpuls",
  insight_prompt_loading: "Impuls wird geladen...",
  insight_prompt_empty: "Kein Impuls verfügbar.",
  insight_mood_title: "Letzte 30 Tage",
  insight_mood_loading: "Trend wird berechnet...",
  insight_entries: "Einträge",
  insight_dominant: "Dominante Stimmung",
  insight_top_count: "Häufigste Stimmung",
  insight_trend: "Trend",
  insight_memory_title: "An diesem Tag",
  insight_memory_loading: "Erinnerungen werden geladen...",
  insight_memory_empty: "Für dieses Datum gibt es noch keine Erinnerung.",
  entry_loading: "Einträge werden geladen...",
  entry_start_here: "Hier starten",
  entry_first_title: "Schreib deinen ersten Eintrag",
  entry_first_desc: "Starte mit einem Satz über heute. Später kannst du ergänzen.",
  entry_first_cta: "Ersten Eintrag erstellen",
  entry_no_content: "Kein Inhalt",
  entry_updated: "Aktualisiert",
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, id, de };

