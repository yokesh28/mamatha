<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'mamatha');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'VQmV8ceSS7~N8d`IW4b=C`Ac+qp|im4nrM%)*03E1?cFjAQMe>bA,){#`AK^JUvA');
define('SECURE_AUTH_KEY',  'qAO_nFf.FHbpEU/pqm2QARr .@pmNs[)V{unAhY+<H.-SZ&&aCR.;:S3Bo=NOiQ3');
define('LOGGED_IN_KEY',    'AwDO(8-99%1#1_;^yd980pdhF&5*2ECx*^6;28s65p~?Uo_89XQ,msy-9<w8t@mC');
define('NONCE_KEY',        'rd4{K&G4Z.TB2Fzqk6DF8$%m#ceBf61bA)]#loESFVO9$/JQ@lE-#D/{RqyTAoR]');
define('AUTH_SALT',        'PLOR~CUmTo{z$&pak.ELNx~a$x{rrL!L]a|$+RvA@^g3X;piN.:owOO;_,4fDlh=');
define('SECURE_AUTH_SALT', 'L=5y3+2:J$<M)j<wNt.NX{WJW^D; 6-^ZC2%{i0zH}+vz).uNMfWY0]819BC7v<3');
define('LOGGED_IN_SALT',   '^{B$Xe*1[KCCy5ZNP@>CeesTo2:()HRWr$+EC;3 d=/0JA#I;Jx!clsnW^M%qI}j');
define('NONCE_SALT',       '2,Iv2%<2y6L)o@W1}WO;qvITkuuxmeS%a,0Q,{9KL_qNur!/zp<?E,_zYW;MjCwb');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
