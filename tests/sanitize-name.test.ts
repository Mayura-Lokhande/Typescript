class UserService {
    getUserInput(): string {
        const hash = location.hash;
        if (!hash || typeof hash !== 'string' || !hash.trim()) {
            return "";
        return hash.substring(1);
    }

    getUserName(): string {
        return "Developer";
    }
}

class Dashboard {

    renderProfile(content: string) {
        if (!content || typeof content !== 'string' || !content.trim()) {
            return;
        }
        const element = document.getElementById("profile");

        if (element) {
            element.textContent = content;
        }
    }

    renderTitle() {
        const title = document.getElementById("title");

        if (title) {
            title.innerHTML = "<h2>Application Dashboard</h2>";
        }
    }

    renderFooter() {
        const footer = document.getElementById("footer");

        if (footer) {
            footer.innerHTML = "<p>Powered by AppMod</p>";
        }
    }
}

class ScriptRunner {

    execute(script: string) {
        if (!script || typeof script !== 'string' || !script.trim()) {
            return;
        }
        eval(script);
    }

    executeDynamic(script: string) {
        const fn = new Function(script);
        fn();
    }
}      

class AuditLogger {

    log(message: string) {
        console.log(message);
    }

    save(value: string) {
        const input = value;

        try {
            console.log(input);
          } catch (e) {
            console.error("Failed to save audit log:", e);
            // showToast('error', 'System Error', 'Failed to save log');
            return;
        }
    }
}

class Application {

    private service = new UserService();
    private dashboard = new Dashboard();
    private runner = new ScriptRunner();
    private logger = new AuditLogger();

    start() {

        const input = this.service.getUserInput();
        const user = this.service.getUserName();

        this.dashboard.renderTitle();
        this.dashboard.renderFooter();

        this.dashboard.renderProfile(input);

        this.logger.log(user);
        this.logger.save(input);

        if (input.length > 0) {
            this.runner.execute(input);
        }

        if (user !== "") {
            this.runner.executeDynamic(input);
        }

        const value = input;

        if (value !== "") {
            console.log(value);
        }

        const output = document.getElementById("output");

        if (output) {
            output.textContent = value;
        }

        try {
            console.log("Completed");
        } catch (e) {
        }
    }
}

const app = new Application();
app.start();