import React, { useEffect, useRef } from 'react';

const GoogleSignInButton = ({ onSuccess, onError }) => {
    const googleButtonRef = useRef(null);

    useEffect(() => {
        const handleCredentialResponse = (response) => {
            if (response.credential) {
                onSuccess(response.credential);
            } else {
                onError('Google Sign-In failed');
            }
        };

        // Load Google Sign-In
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });

            // Render the button
            if (googleButtonRef.current) {
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        theme: 'filled_black',
                        size: 'large',
                        width: '100%',
                        text: 'signin_with',
                        shape: 'rectangular'
                    }
                );
            }
        }
    }, [onSuccess, onError]);

    return (
        <div>
            <div ref={googleButtonRef} className="w-full"></div>
        </div>
    );
};

export default GoogleSignInButton;
