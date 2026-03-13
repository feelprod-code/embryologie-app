-- Define a policy to allow application administrators to update any profile 
-- They need update rights for features like 'Bloquer' or 'Reset appareil'

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

CREATE POLICY "Admins can update any profile" ON profiles
FOR UPDATE
USING (
  auth.email() IN (
    'guillaumephilippe1968@gmail.com',
    'philippe.guillaume@icloud.com',
    'ludovicg13@gmail.com',
    'guillaumephilippe@me.com',
    'sabrinakhanouche@gmail.com'
  )
);
