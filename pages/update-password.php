<div class="update-container">
    <h1 class="update-title">Reset Password</h1>
    <fieldset class="update-fieldset">
        <legend class="update-legend">Update</legend>
        <form class="update-form" action="home.html" method="get">
            <label class="update-label" for="update-email">Email:</label>
            <input class="update-input" type="email" id="update-email" name="email" required>

            <label class="update-label" for="update-password">New Password:</label>
            <input class="update-input" type="password" id="update-password" name="password" required>

            <label class="update-label" for="update-confirm">Confirm Password:</label>
            <input class="update-input" type="password" id="update-confirm" name="confirm" required>

            <button class="update-button" type="submit">Update Password</button>
        </form>
    </fieldset>
    <p class="update-footer"><a class="update-link" href="?page=login">Back to Sign Up</a></p>
</div>