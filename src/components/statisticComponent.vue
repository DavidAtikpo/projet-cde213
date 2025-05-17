<!-- <template>
  <div>
    
    <div class="dropdown">
      <label for="chart-type">Select Chart Type:</label>
      <select v-model="selectedChartType" @change="handleChartTypeChange">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>

    
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-bar"></div>
    </div>

    
    <div v-if="!isLoading">
      <div v-if="selectedChartType === 'daily'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="dailyBarChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="dailyLineChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="dailyDoughnutChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'weekly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="weeklyBarChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="weeklyLineChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="weeklyDoughnutChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'monthly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="monthlyBarChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="monthlyLineChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="monthlyDoughnutChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'yearly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="yearlyBarChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="yearlyLineChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="yearlyDoughnutChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config.js';
import { ref, onMounted, nextTick } from 'vue';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  ArcElement, 
  LineElement 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement);

export default {
  components: {
    Bar,
    Line,
    Doughnut
  },
  setup() {
  
    const selectedChartType = ref('daily');
    const isLoading = ref(true);

    
    const dailyBarChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        backgroundColor: '#42A5F5',
        data: [0, 0, 0, 0, 0, 0, 0] 
      }]
    });

    const dailyLineChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        borderColor: 'none',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: true
      }]
    });

    const dailyDoughnutChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [0, 0, 0, 0, 0, 0, 0],
      }]
    });

    
    const weeklyBarChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        backgroundColor: '#42A5F5',
        data: [] 
      }]
    });

    const weeklyLineChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        borderColor: 'none',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [],
        fill: true
      }]
    });

    const weeklyDoughnutChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [],
      }]
    });

    
    const monthlyBarChartData = ref({
      labels: [], 
      datasets: [{
        label: 'Monthly Average Percentage',
        backgroundColor: '#42A5F5',
        data: []
      }]
    });

    const monthlyLineChartData = ref({
      labels: [], 
      datasets: [{
        label: 'Monthly Average Percentage',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [0],
        fill: true
      }]
    });

    const monthlyDoughnutChartData = ref({
      labels: [], 
      datasets: [{
        label: 'Monthly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [0],
      }]
    });

    
    const yearlyBarChartData = ref({
      labels: [], 
      datasets: [{
        label: 'Yearly Average Percentage',
        backgroundColor: '#42A5F5',
        data: []
      }]
    });

    const yearlyLineChartData = ref({
      labels: [], 
      datasets: [{
        label: 'Yearly Average Percentage',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [],
        fill: true
      }]
    });

    const yearlyDoughnutChartData = ref({
      labels: [], // Add year labels dynamically
      datasets: [{
        label: 'Yearly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [],
      }]
    });

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    const dailyChartKey = ref(0);
    const weeklyChartKey = ref(0);
    const monthlyChartKey = ref(0);
    const yearlyChartKey = ref(0);

    const fetchStats = async () => {
      isLoading.value = true;
      try {
        const [dailyResponse, weeklyResponse, monthlyResponse, yearlyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user/stats/daily`),
          fetch(`${API_BASE_URL}/user/stats/weekly`),
          fetch(`${API_BASE_URL}/user/stats/monthly`),
          fetch(`${API_BASE_URL}/user/stats/yearly`)
        ]);

        const [dailyData, weeklyData, monthlyData, yearlyData] = await Promise.all([
          dailyResponse.json(),
          weeklyResponse.json(),
          monthlyResponse.json(),
          yearlyResponse.json()
        ]);

        // Process Daily Data
        const dailyLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dailyAveragePercentages = Array(dailyLabels.length).fill(0);
        dailyData.forEach(item => {
          const dayIndex = dailyLabels.indexOf(item.day);
          if (dayIndex !== -1) {
            dailyAveragePercentages[dayIndex] = item.averagePercentage;
          }
        });
        dailyBarChartData.value.datasets[0].data = dailyAveragePercentages;
        dailyLineChartData.value.datasets[0].data = dailyAveragePercentages;
        dailyDoughnutChartData.value.datasets[0].data = dailyAveragePercentages;

       
        const weeklyLabels = weeklyData.map(item => `Week ${item.weekNumber}`);
        const weeklyPercentages = weeklyData.map(item => item.averagePercentage);
        console.log("week",weeklyLabels);
        
        weeklyBarChartData.value.labels = weeklyLabels;
        weeklyBarChartData.value.datasets[0].data = weeklyPercentages;
        weeklyLineChartData.value.labels = weeklyLabels;
        weeklyLineChartData.value.datasets[0].data = weeklyPercentages;
        weeklyDoughnutChartData.value.labels = weeklyLabels;
        weeklyDoughnutChartData.value.datasets[0].data = weeklyPercentages;

        
        const monthlyLabels = monthlyData.map(item => item.monthName);
        const monthlyPercentages = monthlyData.map(item => item.averagePercentage);
        monthlyBarChartData.value.labels = monthlyLabels;
        monthlyBarChartData.value.datasets[0].data = monthlyPercentages;
        monthlyLineChartData.value.labels = monthlyLabels;
        monthlyLineChartData.value.datasets[0].data = monthlyPercentages;
        monthlyDoughnutChartData.value.labels = monthlyLabels;
        monthlyDoughnutChartData.value.datasets[0].data = monthlyPercentages;

       
        const yearlyLabels = yearlyData.map(item => item.year);
        const yearlyPercentages = yearlyData.map(item => item.averagePercentage);
        yearlyBarChartData.value.labels = yearlyLabels;
        yearlyBarChartData.value.datasets[0].data = yearlyPercentages;
        yearlyLineChartData.value.labels = yearlyLabels;
        yearlyLineChartData.value.datasets[0].data = yearlyPercentages;
        yearlyDoughnutChartData.value.labels = yearlyLabels;
        yearlyDoughnutChartData.value.datasets[0].data = yearlyPercentages;

        
        nextTick(() => {
          dailyChartKey.value++;
          weeklyChartKey.value++;
          monthlyChartKey.value++;
          yearlyChartKey.value++;
        });

      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleChartTypeChange = () => {
     
      fetchStats();
    };

    onMounted(() => {
      fetchStats();
    });

    return {
      selectedChartType,
      isLoading,
      dailyBarChartData,
      dailyLineChartData,
      dailyDoughnutChartData,
      weeklyBarChartData,
      weeklyLineChartData,
      weeklyDoughnutChartData,
      monthlyBarChartData,
      monthlyLineChartData,
      monthlyDoughnutChartData,
      yearlyBarChartData,
      yearlyLineChartData,
      yearlyDoughnutChartData,
      chartOptions,
      dailyChartKey,
      weeklyChartKey,
      monthlyChartKey,
      yearlyChartKey,
      handleChartTypeChange
    };
  }
};
</script>

<style scoped>
.chart-section {
  margin-bottom: 40px; 
}


.dropdown {
  margin-bottom: 20px;
}


.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #42A5F5;
  overflow: hidden;
}

.loading-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0d47a1;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.charts-horizontal {
  display: flex;
  flex-direction: row;
  gap: 20px; 
}

.charts-vertical {
  display: flex;
  flex-direction: column;
  gap: 20px; 
}

.chart-wrapper {
  width: 100%; 
  
  height: 100vh;
  margin: 0 auto; 
}
.chartt-wrapper {
  width: 100%; 
  max-width: 400px; 
  margin: 0 auto; 
}
</style>






 -->

 <template>
  <div>
    <!-- Dropdown to select chart type -->
    <div class="dropdown">
      <label for="chart-type">Select Chart Type:</label>
      <select v-model="selectedChartType" @change="handleChartTypeChange">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-bar"></div>
    </div>

    <!-- Charts display based on selected chart type -->
    <div v-if="!isLoading">
      <div v-if="selectedChartType === 'daily'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="dailyBarChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="dailyLineChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="dailyDoughnutChartData" :options="chartOptions" :key="dailyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'weekly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="weeklyBarChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="weeklyLineChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="weeklyDoughnutChartData" :options="chartOptions" :key="weeklyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'monthly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="monthlyBarChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="monthlyLineChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="monthlyDoughnutChartData" :options="chartOptions" :key="monthlyChartKey" />
        </div>
      </div>

      <div v-if="selectedChartType === 'yearly'" class="charts-horizontal">
        <div class="chart-wrapper">
          <Bar :data="yearlyBarChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
        <div class="chart-wrapper">
          <Line :data="yearlyLineChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
        <div class="chartt-wrapper">
          <Doughnut :data="yearlyDoughnutChartData" :options="chartOptions" :key="yearlyChartKey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config.js';
import { ref, onMounted, nextTick } from 'vue';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  ArcElement, 
  LineElement 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement);

export default {
  components: {
    Bar,
    Line,
    Doughnut
  },
  setup() {
    // States for charts and loading
    const selectedChartType = ref('daily');
    const isLoading = ref(true);

    // Data for charts
    const dailyBarChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        backgroundColor: '#42A5F5',
        data: [0, 0, 0, 0, 0, 0, 0] 
      }]
    });

    const dailyLineChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        borderColor: 'none',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: true
      }]
    });

    const dailyDoughnutChartData = ref({
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Daily Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [0, 0, 0, 0, 0, 0, 0],
      }]
    });

    // Weekly Charts
    const weeklyBarChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        backgroundColor: '#42A5F5',
        data: [] 
      }]
    });

    const weeklyLineChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        borderColor: 'none',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [],
        fill: true
      }]
    });

    const weeklyDoughnutChartData = ref({
      labels: [], // Add week labels dynamically
      datasets: [{
        label: 'Weekly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [],
      }]
    });

    // Monthly Charts
    const monthlyBarChartData = ref({
      labels: [], // Add month labels dynamically
      datasets: [{
        label: 'Monthly Average Percentage',
        backgroundColor: '#42A5F5',
        data: []
      }]
    });

    const monthlyLineChartData = ref({
      labels: [], // Add month labels dynamically
      datasets: [{
        label: 'Monthly Average Percentage',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [0],
        fill: true
      }]
    });

    const monthlyDoughnutChartData = ref({
      labels: [], // Add month labels dynamically
      datasets: [{
        label: 'Monthly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [0],
      }]
    });

    // Yearly Charts
    const yearlyBarChartData = ref({
      labels: [], // Add year labels dynamically
      datasets: [{
        label: 'Yearly Average Percentage',
        backgroundColor: '#42A5F5',
        data: []
      }]
    });

    const yearlyLineChartData = ref({
      labels: [], // Add year labels dynamically
      datasets: [{
        label: 'Yearly Average Percentage',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        data: [],
        fill: true
      }]
    });

    const yearlyDoughnutChartData = ref({
      labels: [], // Add year labels dynamically
      datasets: [{
        label: 'Yearly Average Percentage',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF6384', '#36A2EB', '#FFCE56'],
        data: [],
      }]
    });

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    const dailyChartKey = ref(0);
    const weeklyChartKey = ref(0);
    const monthlyChartKey = ref(0);
    const yearlyChartKey = ref(0);

    const fetchStats = async () => {
      isLoading.value = true;
      try {
        const [dailyResponse, weeklyResponse, monthlyResponse, yearlyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/user/stats/daily`),
          fetch(`${API_BASE_URL}/user/stats/weekly`),
          fetch(`${API_BASE_URL}/user/stats/monthly`),
          fetch(`${API_BASE_URL}/user/stats/yearly`)
        ]);

        const [dailyData, weeklyData, monthlyData, yearlyData] = await Promise.all([
          dailyResponse.json(),
          weeklyResponse.json(),
          monthlyResponse.json(),
          yearlyResponse.json()
        ]);

        // Process Daily Data
        const dailyLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dailyAveragePercentages = Array(dailyLabels.length).fill(0);
        dailyData.forEach(item => {
          const dayIndex = dailyLabels.indexOf(item.day);
          if (dayIndex !== -1) {
            dailyAveragePercentages[dayIndex] = item.averagePercentage;
          }
        });
        dailyBarChartData.value.datasets[0].data = dailyAveragePercentages;
        dailyLineChartData.value.datasets[0].data = dailyAveragePercentages;
        dailyDoughnutChartData.value.datasets[0].data = dailyAveragePercentages;

        // Process Weekly Data
        const weeklyLabels = weeklyData.map(item => `Week ${item.weekNumber}`);
        const weeklyPercentages = weeklyData.map(item => item.averagePercentage);
        console.log("week",weeklyLabels);
        
        weeklyBarChartData.value.labels = weeklyLabels;
        weeklyBarChartData.value.datasets[0].data = weeklyPercentages;
        weeklyLineChartData.value.labels = weeklyLabels;
        weeklyLineChartData.value.datasets[0].data = weeklyPercentages;
        weeklyDoughnutChartData.value.labels = weeklyLabels;
        weeklyDoughnutChartData.value.datasets[0].data = weeklyPercentages;

        // Process Monthly Data
        const monthlyLabels = monthlyData.map(item => item.monthName);
        const monthlyPercentages = monthlyData.map(item => item.averagePercentage);
        monthlyBarChartData.value.labels = monthlyLabels;
        monthlyBarChartData.value.datasets[0].data = monthlyPercentages;
        monthlyLineChartData.value.labels = monthlyLabels;
        monthlyLineChartData.value.datasets[0].data = monthlyPercentages;
        monthlyDoughnutChartData.value.labels = monthlyLabels;
        monthlyDoughnutChartData.value.datasets[0].data = monthlyPercentages;

        // Process Yearly Data
        const yearlyLabels = yearlyData.map(item => item.year);
        const yearlyPercentages = yearlyData.map(item => item.averagePercentage);
        yearlyBarChartData.value.labels = yearlyLabels;
        yearlyBarChartData.value.datasets[0].data = yearlyPercentages;
        yearlyLineChartData.value.labels = yearlyLabels;
        yearlyLineChartData.value.datasets[0].data = yearlyPercentages;
        yearlyDoughnutChartData.value.labels = yearlyLabels;
        yearlyDoughnutChartData.value.datasets[0].data = yearlyPercentages;

        // Force update of chart components
        nextTick(() => {
          dailyChartKey.value++;
          weeklyChartKey.value++;
          monthlyChartKey.value++;
          yearlyChartKey.value++;
        });

      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleChartTypeChange = () => {
      // Re-fetch stats when chart type changes
      fetchStats();
    };

    onMounted(() => {
      fetchStats();
    });

    return {
      selectedChartType,
      isLoading,
      dailyBarChartData,
      dailyLineChartData,
      dailyDoughnutChartData,
      weeklyBarChartData,
      weeklyLineChartData,
      weeklyDoughnutChartData,
      monthlyBarChartData,
      monthlyLineChartData,
      monthlyDoughnutChartData,
      yearlyBarChartData,
      yearlyLineChartData,
      yearlyDoughnutChartData,
      chartOptions,
      dailyChartKey,
      weeklyChartKey,
      monthlyChartKey,
      yearlyChartKey,
      handleChartTypeChange
    };
  }
};
</script>

<style scoped>
.chart-section {
  margin-bottom: 40px; /* Espacement entre les sections */
}

/* Styles for the dropdown */
.dropdown {
  margin-bottom: 20px;
}

/* Styles for the loading indicator */
.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #42A5F5;
  overflow: hidden;
}

.loading-bar {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0d47a1;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.charts-horizontal {
  display: flex;
  flex-direction: row;
  gap: 20px; /* Espacement entre les graphiques horizontaux */
}

.charts-vertical {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacement entre les graphiques verticaux */
}

.chart-wrapper {
  width: 100%; /* Permet aux graphiques de s'ajuster à la largeur du conteneur */
  /* max-width: 400px; Limite la largeur maximale des graphiques */
  height: 90%;
  margin: 0 auto; /* Centre les graphiques horizontalement dans leur conteneur */
}

.chartt-wrapper {
  width: 100%; /* Permet aux graphiques de s'ajuster à la largeur du conteneur */
  max-width: 200px; /* Limite la largeur maximale des graphiques */
  margin: 0 auto; /* Centre les graphiques horizontalement dans leur conteneur */
}
</style>