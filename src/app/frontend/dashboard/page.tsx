"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
} from "chart.js";
import { Bar, Doughnut, PolarArea } from "react-chartjs-2";

import { me, type AuthProfile } from "@/lib/api/auth";
import {
  listCertificates,
  type CertificateDto,
} from "@/lib/api/certificados";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";
import "./page.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

interface CertificateExtended extends CertificateDto {
  tema?: string;
  tipo_certificado?: string;
  color?: string;
}

export default function DashboardPage() {
  const [certificates, setCertificates] = useState<CertificateExtended[]>([]);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [userName, setUserName] = useState("Usuario");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const profileData = await me();
        if (!isMounted) return;
        setProfile(profileData);
        setUserName(profileData.nombres || "Usuario");

        const data = await listCertificates();
        if (!isMounted) return;
        setCertificates(data as CertificateExtended[]);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Dashboard data load error:", err);
        setError("No se pudo cargar la información del panel.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Aggregations
  const totalHoras = certificates.reduce((acc, cert) => acc + (cert.duracion_horas || 0), 0);
  const totalCertificados = certificates.length;

  // Temas (Doughnut)
  const temasCount = certificates.reduce((acc, cert) => {
    const tema = cert.tema || "Sin clasificar";
    acc[tema] = (acc[tema] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const temasData = {
    labels: Object.keys(temasCount),
    datasets: [
      {
        data: Object.values(temasCount),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#64748b",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Entidades (Bar)
  const entidadesCount = certificates.reduce((acc, cert) => {
    const entidad = cert.entidad || "Desconocida";
    acc[entidad] = (acc[entidad] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort entities by count
  const sortedEntidades = Object.entries(entidadesCount).sort((a, b) => b[1] - a[1]);

  const entidadesData = {
    labels: sortedEntidades.map(([key]) => key),
    datasets: [
      {
        label: "Certificados",
        data: sortedEntidades.map(([, value]) => value),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Tipos (Polar Area)
  const tiposCount = certificates.reduce((acc, cert) => {
    const tipo = cert.tipo_certificado || "Otro";
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tiposData = {
    labels: Object.keys(tiposCount),
    datasets: [
      {
        data: Object.values(tiposCount),
        backgroundColor: [
          "rgba(245, 158, 11, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="statistics"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section fp-stack-md">
              <div className="fp-sidebar__profile">
                <div className="fp-sidebar__avatar-placeholder">
                  <MaterialIcon>person</MaterialIcon>
                </div>
                <div className="fp-stack-xs">
                  <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                    {profile?.nombre_completo ?? "Usuario"}
                  </p>
                  {profile?.titulo_profesional && (
                    <p className="fp-body-sm fp-muted" style={{ margin: 0, fontSize: "0.75rem" }}>
                      {profile.titulo_profesional}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>notifications</MaterialIcon>
          <div className="fp-sidebar__avatar-placeholder">
            <span className="fp-label-md">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </MobileBrandHeader>

        <div className="fp-shell-content">
          <header className="fp-section-intro">
            <h1 className="fp-display-mobile">Métricas y Resumen</h1>
            <p className="fp-body-lg fp-muted">
              Visualiza el progreso de tu aprendizaje y las instituciones de tus certificaciones.
            </p>
          </header>

          {isLoading ? (
            <div className="fp-loading-state" style={{ marginTop: "4rem", textAlign: "center" }}>
              <MaterialIcon className="fp-icon--spin" style={{ fontSize: "2rem", color: "var(--fp-primary)" }}>
                refresh
              </MaterialIcon>
              <p>Cargando panel...</p>
            </div>
          ) : error ? (
            <div className="fp-error-state" style={{ marginTop: "2rem", color: "var(--fp-error)" }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="fp-dashboard-grid">
              {/* Tarjeta de Resumen */}
              <div className="fp-dashboard-card">
                <h2><MaterialIcon>insights</MaterialIcon> Vista General</h2>
                <div className="fp-dashboard-summary">
                  <div className="fp-summary-item">
                    <span className="fp-summary-item__label">Certificados Totales</span>
                    <span className="fp-summary-item__value">{totalCertificados}</span>
                  </div>
                  <div className="fp-summary-item">
                    <span className="fp-summary-item__label">Horas Acumuladas</span>
                    <span className="fp-summary-item__value">{totalHoras} h</span>
                  </div>
                </div>
              </div>

              {/* Gráfico de Temas */}
              <div className="fp-dashboard-card">
                <h2><MaterialIcon>pie_chart</MaterialIcon> Distribución por Temas</h2>
                <div className="fp-chart-container">
                  {Object.keys(temasCount).length > 0 ? (
                    <Doughnut data={temasData} options={doughnutOptions} />
                  ) : (
                    <p className="fp-muted" style={{ textAlign: "center", marginTop: "2rem" }}>Sin datos de temas.</p>
                  )}
                </div>
              </div>

              {/* Gráfico de Tipos */}
              <div className="fp-dashboard-card">
                <h2><MaterialIcon>military_tech</MaterialIcon> Tipos de Certificado</h2>
                <div className="fp-chart-container">
                  {Object.keys(tiposCount).length > 0 ? (
                    <PolarArea data={tiposData} options={doughnutOptions} />
                  ) : (
                    <p className="fp-muted" style={{ textAlign: "center", marginTop: "2rem" }}>Sin datos de tipos.</p>
                  )}
                </div>
              </div>

              {/* Gráfico de Entidades */}
              <div className="fp-dashboard-card">
                <h2><MaterialIcon>domain</MaterialIcon> Certificados por Entidad</h2>
                <div className="fp-chart-container">
                  {Object.keys(entidadesCount).length > 0 ? (
                    <Bar data={entidadesData} options={barOptions} />
                  ) : (
                    <p className="fp-muted" style={{ textAlign: "center", marginTop: "2rem" }}>Sin datos de entidades.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
