/**
 * Utilitaires pour gérer les dates et fuseaux horaires
 */

/**
 * Convertit une date/heure en format ISO en respectant le fuseau horaire local
 * @param {string} dateTimeString - Date au format "YYYY-MM-DDTHH:mm" ou ISO
 * @returns {Date} - Date corrigée pour le fuseau horaire local
 */
export function parseLocalDateTime(dateTimeString) {
    if (!dateTimeString) return null;

    // Si la date contient déjà un fuseau horaire, on la parse normalement
    if (dateTimeString.includes('Z') || dateTimeString.includes('+') || dateTimeString.includes('-')) {
        return new Date(dateTimeString);
    }

    // Sinon, on considère que c'est une date locale
    // On ajoute le fuseau horaire local pour éviter l'interprétation UTC
    const date = new Date(dateTimeString);
    const timezoneOffset = date.getTimezoneOffset() * 60000; // en millisecondes
    return new Date(date.getTime() + timezoneOffset);
}

/**
 * Formate une date pour l'affichage en français
 * @param {string|Date} dateTime - Date à formater
 * @returns {string} - Date formatée
 */
export function formatLocalDateTime(dateTime) {
    if (!dateTime) return "N/A";

    const date = typeof dateTime === 'string' ? parseLocalDateTime(dateTime) : dateTime;

    return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris' // Force le fuseau horaire français
    });
}

/**
 * Convertit date et time HTML en ISO string pour le serveur
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {string} time - Heure au format HH:mm
 * @returns {string} - ISO string avec fuseau horaire local
 */
export function createLocalDateTime(date, time) {
    if (!date || !time) return null;

    // Crée une date locale (pas UTC)
    const localDate = new Date(`${date}T${time}`);
    return localDate.toISOString();
}
