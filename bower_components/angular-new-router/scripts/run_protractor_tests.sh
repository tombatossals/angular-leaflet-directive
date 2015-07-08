set -e

killSeleniumAndWebserver() {
  if [ -n "$SELENIUM_PID" ]; then
    echo "Killing Selenium..."
    kill $SELENIUM_PID
  fi

  if [ -n "$WEBSERVER_PID" ]; then
    echo "Killing the web server..."
    kill $WEBSERVER_PID
  fi
}

trap "killSeleniumAndWebserver" INT TERM EXIT


if [ -z "$TRAVIS" ]; then
  SELENIUM_JAR="./selenium-server-standalone-2.41.0.jar"

  if [ ! -f $SELENIUM_JAR ]; then
    # Download Selenium.
    curl http://selenium-release.storage.googleapis.com/2.41/selenium-server-standalone-2.41.0.jar > $SELENIUM_JAR
  fi

  CHROMEDRIVER_BIN="./chromedriver/chromedriver"
  if [ ! -f $CHROMEDRIVER_BIN ]; then

    OS=$(uname -s)
    if [[ $OS = "Darwin" ]]; then
      unzip ./chromedriver/chromedriver_mac.zip -d chromedriver
    elif [[ $OS = "Linux" ]]; then
      unzip ./chromedriver/chromedriver_linux.zip -d chromedriver
    else
      echo "There is no chromedriver binary for $OS."
      exit 1
    fi
  fi

  # Start Selenium.
  java -jar $SELENIUM_JAR -Dwebdriver.chrome.driver=$CHROMEDRIVER_BIN > selenium.log &
  SELENIUM_PID=$!
fi


# Start the webserver
gulp serve > connect-webserver.log &
WEBSERVER_PID=$!


# Lame, wait for Selenium and the webserver to start.
sleep 10


# Run Protractor.
./node_modules/.bin/protractor examples/protractor.conf.js
