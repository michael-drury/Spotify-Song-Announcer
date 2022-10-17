import React from 'react';

function Logout() {
    return (
        <div className="App">
            <header className="App-header">
                <a className="btn-spotify" href="/auth/logout" >
                    Log Out
                </a>
            </header>
        </div>
    );
}

export default Logout;

