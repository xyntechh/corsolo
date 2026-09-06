const os = require("os");
const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

// Bytes → GB
const toGB = (bytes) => {
  return Number((bytes / (1024 ** 3)).toFixed(2));
};

const getCpuUsage = () => {
  return new Promise((resolve) => {
    const start = os.cpus();

    setTimeout(() => {
      const end = os.cpus();

      let idle = 0;
      let total = 0;

      for (let i = 0; i < start.length; i++) {
        const startCpu = start[i].times;
        const endCpu = end[i].times;

        const idleDiff = endCpu.idle - startCpu.idle;

        const totalStart =
          startCpu.user +
          startCpu.nice +
          startCpu.sys +
          startCpu.idle +
          startCpu.irq;

        const totalEnd =
          endCpu.user +
          endCpu.nice +
          endCpu.sys +
          endCpu.idle +
          endCpu.irq;

        const totalDiff = totalEnd - totalStart;

        idle += idleDiff;
        total += totalDiff;
      }

      const usage = 100 - (idle / total) * 100;

      resolve(Number(usage.toFixed(2)));
    }, 500);
  });
};

exports.getServerStats = async (req, res) => {
  try {
    const cpus = os.cpus();

    const cpuUsage = await getCpuUsage();

    // =========================
    // MEMORY
    // =========================

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // =========================
    // DISK
    // =========================

    let disk = null;

    try {
      const { stdout } = await execAsync("df -B1 / | tail -1");

      const parts = stdout.trim().split(/\s+/);

      disk = {
        totalGB: toGB(Number(parts[1])),
        usedGB: toGB(Number(parts[2])),
        availableGB: toGB(Number(parts[3])),
        usagePercent: parseFloat(parts[4]),
      };
    } catch (error) {
      console.error("Disk stats error:", error);
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      os: {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        architecture: os.arch(),
        hostname: os.hostname(),

        uptimeSeconds: os.uptime(),
      },

      cpu: {
        model: cpus[0]?.model,
        cores: cpus.length,
        speedMHz: cpus[0]?.speed,

        usagePercent: cpuUsage,

        loadAverage: os.loadavg(),
      },

      memory: {
        totalGB: toGB(totalMemory),
        usedGB: toGB(usedMemory),
        freeGB: toGB(freeMemory),

        usagePercent: Number(
          ((usedMemory / totalMemory) * 100).toFixed(2)
        ),
      },

      disk,

      node: {
        version: process.version,
        platform: process.platform,
        architecture: process.arch,
        pid: process.pid,

        uptimeSeconds: Number(process.uptime().toFixed(2)),

        memoryUsage: {
          rssGB: toGB(process.memoryUsage().rss),
          heapTotalGB: toGB(process.memoryUsage().heapTotal),
          heapUsedGB: toGB(process.memoryUsage().heapUsed),
          externalGB: toGB(process.memoryUsage().external),
          arrayBuffersGB: toGB(process.memoryUsage().arrayBuffers),
        },
      },

      serverTime: new Date().toISOString(),
    });

  } catch (error) {
    console.error("getServerStats:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch server stats",
    });
  }
};