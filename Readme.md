Web service primary URL:
https://c346splatoonweaponsl16.onrender.com

Retrieve all weapons:
https://c346splatoonweaponsl16.onrender.com/allweapons

Add weapon:
https://c346splatoonweaponsl16.onrender.com/addweapon

{"weapon_name": "Splat Brella"
"weapon pic": "https://cdn.wikimg.net/en/splatoonwiki/images/2/27/S3_Weapon_Main_Splat_Brella.png" }

Update weapon: Use PUT instead of POST
https://c346splatoonweaponsl16.onrender.com/weapons/4
{
"weapon_name": "Splattershot Pro",
"weapon_pic": "https://cdn.wikimg.net/en/splatoonwiki/images/7/77/S3_Weapon_Main_Splattershot_Pro.png",
"weapon_id": "4" }

Delete weapon: Change the type to DELETE instead of PUT
https://c346splatoonweaponsl16.onrender.com/weapons/4
