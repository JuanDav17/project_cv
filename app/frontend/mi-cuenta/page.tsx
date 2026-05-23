import Image from "next/image";
import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

export default function MiCuentaPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="settings"
        header={
          <div className="fp-sidebar__section">
            <div className="fp-sidebar__profile fp-sidebar__profile--centered">
              <Image
                alt="Organization Logo"
                className="fp-sidebar__avatar fp-sidebar__avatar--large"
                height={64}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK3cB3oT-kUQ8301_5CRMNdeyNRaF9UTl-JPYzlY75DPzRcq7jyXnfBQwI_mTw5ZjPkhOC-vb0crz3YL2imkJ6_DxqM8eCUb4YVnsqLkkBD0k2ZHMfvtPQhNTvTtEJ6O-tYX3oUtp3oLwgsAxDIYKqiTNN-RHmr2Y2KYU1l9_XZgLV2pmcpdy0Y9tUbEorUM30kW9CIg_xLal13l-9rkYI08j5ig6-myWQfRPyvDB6bHpll8fnCMFW7TusZQr6RhV9jkGj-hyCvyBo"
                width={64}
              />
              <div className="fp-stack-xs">
                <h2 className="fp-headline-md" style={{ margin: 0, color: "var(--fp-primary)" }}>
                  Professional Tier
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Verified Member
                </p>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="fp-stack-md">
            <button className="fp-button fp-button--primary fp-button--full" type="button">
              Upgrade Plan
            </button>
            <Link className="fp-sidebar__link fp-label-md" href="/frontend">
              <MaterialIcon>help</MaterialIcon>
              <span>Help Center</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>menu</MaterialIcon>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Account Settings
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Manage your profile, security preferences, and privacy controls.
            </p>
          </header>

          <section className="fp-settings-grid">
            <article className="fp-card fp-card--panel fp-stack-lg">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>person</MaterialIcon>
                  Personal Information
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Update your basic profile details.
                </p>
              </div>

              <div className="fp-divider" />

              <form className="fp-stack-lg">
                <div className="fp-grid-two">
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="first-name">
                      First Name
                    </label>
                    <input id="first-name" className="fp-input" defaultValue="Alex" type="text" />
                  </div>
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="last-name">
                      Last Name
                    </label>
                    <input id="last-name" className="fp-input" defaultValue="Morgan" type="text" />
                  </div>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="account-email">
                    Email Address
                  </label>
                  <input
                    id="account-email"
                    className="fp-input"
                    defaultValue="alex.morgan@example.com"
                    type="email"
                  />
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    This email will be used for certification deliveries.
                  </p>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="title">
                    Professional Title
                  </label>
                  <input
                    id="title"
                    className="fp-input"
                    defaultValue="Senior Systems Engineer"
                    type="text"
                  />
                </div>

                <div className="fp-divider" />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="fp-button fp-button--primary" type="button">
                    Save Changes
                  </button>
                </div>
              </form>
            </article>

            <div className="fp-settings-column">
              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>lock</MaterialIcon>
                  Security
                </h2>

                <div className="fp-divider" />

                <div className="fp-stack-md">
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="current-password">
                      Current Password
                    </label>
                    <input id="current-password" className="fp-input" placeholder="••••••••" type="password" />
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="new-password">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      className="fp-input"
                      placeholder="New secure password"
                      type="password"
                    />
                  </div>

                  <button className="fp-button fp-button--secondary fp-button--full" type="button">
                    Update Password
                  </button>
                </div>
              </article>

              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>visibility</MaterialIcon>
                  Profile Privacy
                </h2>

                <div className="fp-divider" />

                <label className="fp-settings-toggle">
                  <input defaultChecked type="checkbox" />
                  <span className="fp-settings-toggle__track">
                    <span className="fp-settings-toggle__thumb" />
                  </span>
                  <span className="fp-stack-xs">
                    <span className="fp-label-md" style={{ color: "var(--fp-on-surface)" }}>
                      Public Profile
                    </span>
                    <span className="fp-body-sm fp-muted">
                      Allow employers to find your credentials via search.
                    </span>
                  </span>
                </label>

                <label className="fp-settings-toggle">
                  <input type="checkbox" />
                  <span className="fp-settings-toggle__track">
                    <span className="fp-settings-toggle__thumb" />
                  </span>
                  <span className="fp-stack-xs">
                    <span className="fp-label-md" style={{ color: "var(--fp-on-surface)" }}>
                      Show Analytics
                    </span>
                    <span className="fp-body-sm fp-muted">
                      Display your learning progress on your public page.
                    </span>
                  </span>
                </label>
              </article>
            </div>
          </section>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
